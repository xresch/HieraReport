package com.hierareport.reporter;

import java.io.File;

import java.io.InputStream;
import java.util.LinkedHashMap;
import java.util.concurrent.ConcurrentHashMap;
import java.util.logging.Logger;
import java.util.zip.ZipInputStream;

import com.hierareport.reporter.ReportItem.ItemStatus;
import com.hierareport.reporter.ReportItem.ItemType;
import com.hierareport.utils.Utils;

/**************************************************************************************
 * The Report class provides methods to add items to the reports, create screenshots
 * and write the report to the disk.
 * 
 * © Reto Scheiwiller, 2017 - MIT License
 **************************************************************************************/

public class Report {
	
	private static final String REPORT_BASE_DIR = "./taureport";
	
	private static int testNumber = 1;

	// For each type until test level one thread local to make it working in multi-threaded mode
	private static InheritableThreadLocal<ReportItem> rootItem = new InheritableThreadLocal<ReportItem>();
	private static InheritableThreadLocal<ReportItem> currentSuite = new InheritableThreadLocal<ReportItem>();
	private static InheritableThreadLocal<ReportItem> currentClass = new InheritableThreadLocal<ReportItem>();

	private static ConcurrentHashMap<String,ReportItem> startedClasses = new ConcurrentHashMap<String,ReportItem>();
	
	private static InheritableThreadLocal<ReportItem> activeItem = new InheritableThreadLocal<ReportItem>();
	
	//everything else goes here.
	private static ThreadLocal<ReportItem> currentTest = new ThreadLocal<ReportItem>();
	private static ThreadLocal<LinkedHashMap<String,ReportItem>> openItems = new ThreadLocal<LinkedHashMap<String,ReportItem>>();
	
	private static Logger logger = Logger.getLogger(Report.class.getName());
	private static InheritableThreadLocal<WebDriver> driver = new InheritableThreadLocal<WebDriver>();
	
	/***********************************************************************************
	 * Initialize the Report and clean up the report directory.
	 ***********************************************************************************/
	protected static void initialize(){
		initializeThreadLocals();
		
		logger.info("Cleanup report directory: "+REPORT_BASE_DIR);
    	ReportUtils.deleteRecursively(new File(REPORT_BASE_DIR));
    	//Utils.copyRecursively(RESOURCE_BASE_DIR, REPORT_BASE_DIR);
    	    	
    	InputStream in = Report.class.getClassLoader().getResourceAsStream("com/csg/tau/framework/utils/reporter/reportFiles.zip.txt");
    	ZipInputStream zipStream = new ZipInputStream(in);
    	ReportUtils.extractZipFile(zipStream, REPORT_BASE_DIR);


    	
    	
	} 
	

	public static void setDriver(WebDriver driver) {
		Report.driver.set(driver);;
	}
	
	private static void initializeThreadLocals(){
		
		if(rootItem.get() == null) {
			rootItem.set(new ReportItem(ItemType.Step,"root"));
		}
		
		if(activeItem.get() == null) {
			activeItem.set(rootItem.get());
		}
		
		if(openItems.get() == null) {
			openItems.set(new LinkedHashMap<String,ReportItem>());
		}
		
	}
	
	protected static LinkedHashMap<String,ReportItem> openItems(){
		initializeThreadLocals();
		return openItems.get();
	}
	
	
	public static ReportItem getActiveItem(){
		initializeThreadLocals();
		return activeItem.get();
	}
	
	protected static void setCurrentTest(ReportItem testItem){
		currentTest.set(testItem);
	}
	
	protected static String getTestDirectory(){
		String testfolderName = currentTest.get().getFixSizeNumber() + "_" + currentTest.get().getTitle();
		return REPORT_BASE_DIR+"/"+testfolderName.replaceAll("[^a-zA-Z0-9]", "_")+"/";
	}
	
	/***********************************************************************************
	 * Starts a new suite, sets it as the active group and returns it to be able to set 
	 * further details.
	 ***********************************************************************************/
	public static ReportItem startSuite(String title){
		
		currentSuite.set(Report.startItem(ItemType.Suite, title));
		
		return currentSuite.get();
	}
	
	/***********************************************************************************
	 * Ends the current Suite.
	 ***********************************************************************************/
	public static ReportItem endCurrentSuite(){
		
		ReportItem suiteItem = currentSuite.get();
		Report.end(suiteItem.getTitle());
		
		return currentSuite.get();
	}
	
	/***********************************************************************************
	 * Starts a new class, sets it as the active group and returns it to be able to set 
	 * further details.
	 ***********************************************************************************/
	public static ReportItem startClass(String title){
		
		if(startedClasses.containsKey(title)){
			ReportItem classItem = startedClasses.get(title);
			activeItem.set(classItem);
			return classItem;
		}
		
		ReportItem classItem = Report.startItem(ItemType.Class, title, currentSuite.get());
		currentClass.set(classItem);
		startedClasses.put(title, classItem);
		
		return classItem;
	}
	
	/***********************************************************************************
	 * Ends the current Class.
	 ***********************************************************************************/
	public static ReportItem endCurrentClass(){
		
		ReportItem classItem = ReportItem.getFirstElementWithType(activeItem.get(), ItemType.Class);

		if(classItem != null){
			Report.end(classItem.getTitle());
		}else{
			logger.warning("The current class could not be ended.");
		}
		
		return classItem;
	}
	
	/***********************************************************************************
	 * Starts a new test, sets it as the active group and returns it to be able to set 
	 * further details.
	 ***********************************************************************************/
	public static ReportItem startTest(String title){
		
		currentTest.set(Report.startItem(ItemType.Test, title, currentClass.get()).setItemNumber(testNumber));
		testNumber++;
		
		resetItemCounter();
		
		return currentTest.get();
	}
	
	/***********************************************************************************
	 * Ends the currentTest.
	 ***********************************************************************************/
	public static ReportItem endCurrentTest(ItemStatus status){
		
		ReportItem testItem = ReportItem.getFirstElementWithType(activeItem.get(), ItemType.Test);
		
		if(testItem != null){
			testItem.setStatus(status);
			
			Report.end(testItem.getTitle());
	    	//Report.setStatusOnCurrentTree(status);
			ReportUtils.writeStringToFile(getTestDirectory(), "result.json", Utils.generateJSON(testItem));
			
			logger.info("TEST END - "+testItem.getTitle()+" ["+status.name().toUpperCase()+"]");
		}else{
			logger.warning("No active test found, test could not be ended.");
		}
		
		return testItem;
	}
	

	/***********************************************************************************
	 * Starts a new group, sets it as the active group and returns it to be able to set 
	 * further details.
	 ***********************************************************************************/
	public static ReportItem start(String title){
		
		return startItem(ItemType.Step, title);
	}
	
	/***********************************************************************************
	 * Starts a new group, sets it as the active group and returns it to be able to set 
	 * further details.
	 ***********************************************************************************/
	public static ReportItem startWait(String title){
		
		return startItem(ItemType.Wait, title);
	}
	
	/***********************************************************************************
	 * Starts a new group, sets it as the active group and returns it to be able to set 
	 * further details.
	 ***********************************************************************************/
	public static ReportItem startAssert(String title){
		
		return startItem(ItemType.Assert, title);
	}
	
	/***********************************************************************************
	 * Starts a new item, sets it as the active group and returns it to be able to set 
	 * further details.
	 ***********************************************************************************/
	private static ReportItem startItem(ItemType type, String title){
		
		return Report.startItem(type, title, null);
	}
	
	/***********************************************************************************
	 * Starts a new item, sets it as the active group and returns it to be able to set 
	 * further details.
	 ***********************************************************************************/
	private static ReportItem startItem(ItemType type, String title, ReportItem parent){
				
		ReportItem item = new ReportItem(type, title);
		
		logger.info("START "+getLogIndendation()+" "+item.getFixSizeNumber()+" "+title);	
		
		if(parent == null){
			item.setParent(getActiveItem());
		}else{
			item.setParent(parent);
		}
		activeItem.set(item);
		
		openItems().put(title, item);
		return item;
	}
	
	/***********************************************************************************
	 * Add a item to the report without the need of starting and ending it.
	 ***********************************************************************************/
	public static ReportItem addInfoMessage(String title, String message){
				
		return addItem(ItemType.MessageInfo, title).setDescription(message).setStatus(ItemStatus.Undefined);
	}
	
	/***********************************************************************************
	 * Add a item to the report without the need of starting and ending it.
	 ***********************************************************************************/
	public static ReportItem addWarnMessage(String title, String message){
				
		return addItem(ItemType.MessageWarn, title).setDescription(message).setStatus(ItemStatus.Undefined);
	}
	
	/***********************************************************************************
	 * Add a item to the report without the need of starting and ending it.
	 ***********************************************************************************/
	public static ReportItem addErrorMessage(String title, String message){
				
		return addItem(ItemType.MessageError, title).setDescription(message).setStatus(ItemStatus.Undefined);
	}
	
	/***********************************************************************************
	 * Add a item to the report without the need of starting and ending it.
	 ***********************************************************************************/
	public static ReportItem addErrorMessage(String title, String message, Throwable e){
				
		return addItem(ItemType.MessageError, title)
				.setDescription(message)
				.setException(e);
	}
	
	/***********************************************************************************
	 * Add a item to the report without the need of starting and ending it.
	 ***********************************************************************************/
	public static ReportItem addItem(ItemType type, String title){
		
		logger.info("  ADD   "+getLogIndendation()+" "+title);	
		
		ReportItem item = new ReportItem(type, title);
		item.setParent(getActiveItem());
		
		return item;
	}
	
	/***********************************************************************************
	 * Close the item and returns it to be able to set further details.
	 ***********************************************************************************/
	public static ReportItem end(String title){

		if(!openItems().isEmpty()
		&& openItems().containsKey(title)){
			ReportItem itemToEnd = openItems().get(title);
			
			try{
				if(driver.get() != null){
					itemToEnd.endItem().setUrl(driver.get().getCurrentUrl());
				}
			}catch(Exception e){
				//Ignore exceptions like SessionNotFoundException
			}
			
			if(!itemToEnd.equals(getActiveItem())){
				logger.severe("Items are not closed in the correct order: '"+itemToEnd.getTitle()+"'");
			}
			activeItem.set(itemToEnd.getParent());
			openItems().remove(title);
			
			return itemToEnd;
		}else{
			logger.warning("The item is not started and can not be ended: '"+title+"'");
			return new ReportItem(ItemType.MessageInfo, "Prevent NullPointerException");
		}
		
		
	}
	
    /**************************************************************************************
	 * Save a screenshot of the current page to a file and add a step to the report.
	 * This will only work if the used Driver will support taking screenshots.
	 * 
     **************************************************************************************/ 
	public static void takeScreenshotHTML(){
		
		WebDriver localDriver = driver.get();
		if(localDriver == null){
			logger.warning("Cannot take screenshots without a driver, please call Report.setDriver() first."); 
			return;
		}
		
	    if(localDriver instanceof TakesScreenshot) {
	    	
	    	try{
	    		
	    		String filename = getActiveItem().getFixSizeNumber()+"_Screenshot_"+getActiveItem().getTitle().replaceAll("[^a-zA-Z0-9]", "_")+".html";
	    		String directory = getTestDirectory()+"screenshots";
	    	    
		    	String screenshot = "";
		    	
		        // Get the screenshot as Base64 data
		        String screenshotContent = ((TakesScreenshot)localDriver).getScreenshotAs(OutputType.BASE64);
		        
		        String  currentUrl = driver.get().getCurrentUrl();
	
	
		        screenshot = "<html><head><title>" + localDriver.getTitle() + "</title></head><body>" +
		                "<p>URL:" + currentUrl + "</p>" +
		                "<img src=\"data:image/png;base64," + screenshotContent + "\" " +
		                "alt=\"" + currentUrl + "\" />" +
		                "</body></html>";
	
	        	String filepath = directory+"/"+filename;
	        	ReportUtils.writeStringToFile(directory, filename, screenshot);
				getActiveItem().setScreenshotPath(filepath.replace(REPORT_BASE_DIR, "./"));
			
			}catch(Exception e){
				logger.severe("An exception occured on taking screenshot", e);
			}
		    
	    } else {
	        logger.warning("Driver does not support taking screenshots");
	    }
	    	
	}
	
    /**************************************************************************************
	 * Save a screenshot of the current page to a file and add a step to the report.
	 * This will only work if the used Driver will support taking screenshots.
	 * 
     **************************************************************************************/ 
	public static void takeScreenshot(){
		
		WebDriver localDriver = driver.get();
		if(localDriver == null){
			logger.warning("Cannot take screenshots without a driver, please call Report.setDriver() first."); 
			return;
		}
		
	    if(localDriver instanceof TakesScreenshot) {
	    	
	    	try{
	    		
	    		String filename = getActiveItem().getFixSizeNumber()+"_Screenshot_"+getActiveItem().getTitle().replaceAll("[^a-zA-Z0-9]", "_")+".png";
	    		String directory = getTestDirectory()+"screenshots";
	    		String filepath = directory+"/"+filename;
		    	
		        // Get the screenshot as Base64 data
		        byte[] screenshotBytes = ((TakesScreenshot)localDriver).getScreenshotAs(OutputType.BYTES);
		        FileUtils.writeByteArrayToFile(new File(filepath), screenshotBytes);

				getActiveItem().setScreenshotPath(filepath.replace(REPORT_BASE_DIR, "./"));
			
			}catch(Exception e){
				logger.warn("An exception occured on taking screenshot", e);
			}
		    
	    } else {
	        logger.warn("Driver does not support taking screenshots");
	    }
	    	
	}
	
    /**************************************************************************************
	 * Save a screenshot of the current page to a file and add a step to the report.
	 * This will only work if the used Driver will support taking screenshots.
	 * 
     **************************************************************************************/ 
	public static void saveHTMLSource(){
		WebDriver localDriver = driver.get();
		
		if(localDriver == null){
			logger.warning("Cannot save HTML source without a driver, please call Report.setDriver() first."); 
			return;
		}
		
		try{
			String filename = getActiveItem().getFixSizeNumber()+"_HTML_"+getActiveItem().getTitle().replaceAll("[^a-zA-Z0-9]", "_")+".html";
			String directory = getTestDirectory()+"htmlSources";
	    	
	        String source = localDriver.getPageSource();
	        
	    	String filepath = directory+"/"+filename;
	    	ReportUtils.writeStringToFile(directory, filename, source);
			getActiveItem().setSourcePath(filepath.replace(REPORT_BASE_DIR, "./"));
			
		}catch(Exception e){
			logger.severe("An exception occured on saving the HTML source.", e);
		}
		
	}

	/***********************************************************************************
	 * Return the current active step.
	 ***********************************************************************************/
	protected static void setStatusOnCurrentTree(ItemStatus status){
			
		for(ReportItem item : openItems().values()){

			if(status == ItemStatus.Fail){ 
				item.setStatus(status);
			}else if (status == ItemStatus.Skipped && item.getStatus() != ItemStatus.Fail){
				item.setStatus(status);
			}else if(status == ItemStatus.Success && item.getStatus() == ItemStatus.Undefined){
				item.setStatus(status);
			}
						
		}
	}
	
	/***********************************************************************************
	 * Log Indendation
	 ***********************************************************************************/
	private static String getLogIndendation(){
		StringBuffer logIndentation = new StringBuffer("--");
		
		int level = (activeItem.get() != null) ? activeItem.get().getLevel() : 0;
		
		for(int i = 0; i < level ; i++){
			logIndentation.append("--");
		}
		return logIndentation.toString();
	}
	
	/***********************************************************************************
	 * Reset Item Counter.
	 ***********************************************************************************/
	protected static void resetItemCounter(){
		ReportItem.resetItemCounter();
	}
	
	/***********************************************************************************
	 * Create the report.
	 ***********************************************************************************/
	protected static void createFinalReport(){
		
		for(ReportItem item : openItems().values()){
			logger.warning("Item was not ended properly: '"+item.getTitle()+"'");
			item.endItem().setTitle(item.getTitle()+"(NOT ENDED PROPERLY)");
		}
		String json = Utils.generateJSON(rootItem.get().getChildren());

		String javascript = "DATA = DATA.concat(\n"+json+"\n);";
		ReportUtils.writeStringToFile(REPORT_BASE_DIR, "data.js", javascript);
	}
	
}
