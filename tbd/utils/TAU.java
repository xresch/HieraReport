package com.hierareport.utils;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import org.openqa.selenium.ElementNotVisibleException;
import org.openqa.selenium.InvalidElementStateException;
import org.openqa.selenium.StaleElementReferenceException;
import org.openqa.selenium.WebElement;
import org.testng.Assert;
import org.testng.SkipException;
import org.testng.asserts.SoftAssert;

import com.reporter.Report;
import com.reporter.ReportItem;
import com.reporter.ReportItem.ItemStatus;
import com.reporter.ReportItem.ItemType;

/**
 * Utility class with useful methods to do the test automation.
 * @author F983351
 *
 */
public class TAU {
	
	private static final Logger logger = Logger.getLogger(TAU.class.getName());
	private static InheritableThreadLocal<HashMap<String, Long>> stopwatchStartNanos = new InheritableThreadLocal<HashMap<String, Long>>();
	private static InheritableThreadLocal<HashMap<String, String>> threadLocalValues = new InheritableThreadLocal<HashMap<String, String>>();
	
	private static ThreadLocal<SoftAssert> softAssert = new ThreadLocal<SoftAssert>();

	public enum STATUS{ Pass, Fail, Skip, Completed, Warning, Error, Info }
	
    /**************************************************************************************
	 * Return the thread local softAssert instance.
     **************************************************************************************/ 
	private static SoftAssert getSoftAssert(){
		
		if(softAssert.get() == null) softAssert.set(new SoftAssert());
		
		return softAssert.get();
	
	}
	
    /**************************************************************************************
	 * Save a key/value pair to a ThreadLocal Hashmap.
	 * @param originClass the class which is propagating the value
     **************************************************************************************/ 
	public static void setThreadLocalValue(Class originClass, String key, String value){
		
		if(threadLocalValues.get() == null) threadLocalValues.set(new HashMap<String, String>());
		
		threadLocalValues.get().put(originClass.getName()+"."+key, value);
	
	}
	
    /**************************************************************************************
	 * Get the value you have saved with setThreadLocalValue, returns null if nothing is
	 * specified for the key.
	 * 
     **************************************************************************************/ 
	public static String getThreadLocalValue(Class originClass, String key){
		
		if(threadLocalValues.get() == null) threadLocalValues.set(new HashMap<String, String>());
		
		return threadLocalValues.get().get(originClass.getName()+"."+key);
		
	}
	
	
    /**************************************************************************************
	 * Starts a step report, this will start a duration measurement for the step.
	 * 
     **************************************************************************************/ 
	public static ReportItem startStep(String title){
		return Report.start(title);
	}
	
    /**************************************************************************************
	 * Add a Message to the report and returns the item so you can set further details.
	 * Use this if you don't need to start and stop the step e.g. for adding messages to
	 * the report.
	 * 
     **************************************************************************************/ 
	public static ReportItem addMessage(String title){
		return Report.addItem(ItemType.MessageInfo, title).setStatus(ItemStatus.Undefined);
	}
	
	
    /**************************************************************************************
	 * Ends a step report, this can be used without calling startStep() before, in this
	 * case you won't have any duration measurement for this step.
	 * 
     **************************************************************************************/ 
	public static ReportItem endStep(String title){
		return Report.end(title);
	}
	

    /**************************************************************************************
	 * Start a group, all steps and groups executed until the group is ended will be 
	 * grouped into an expandable panel in the report. Make sure to end all groups you have 
	 * opened, else you won't have any data in the report.
	 * 
     **************************************************************************************/ 
	public static ReportItem start(String groupName){ 
		return Report.start(groupName);
	}
	
    /**************************************************************************************
	 * Takes a screenshot and saves the HTML source and then closes the group. 
	 * 
     **************************************************************************************/ 
	public static ReportItem end(String groupName){
		TAU.saveScreenshot(groupName);
		TAU.saveHTML(groupName);
		ReportItem item = Report.end(groupName);
		return item;
	}
	
	
    /**************************************************************************************
	 * Start a group for assertions, make sure to end all groups you have 
	 * opened, else you won't have any data in the report.
	 * 
     **************************************************************************************/ 
	protected static ReportItem startAssert(String groupName){ return start("[Assert] "+ groupName).setType(ItemType.Assert);}
	
    /**************************************************************************************
	 * Ends a group for assertions, does not take any screenshots.
	 * 
     **************************************************************************************/ 
	protected static ReportItem endAssert(String groupName){ return end("[Assert] "+ groupName); }
	
    /**************************************************************************************
	 * Ends a group for assertions, does not take any screenshots.
	 * 
     **************************************************************************************/ 
	public static void setTestSkipped(Throwable t){ 
		
		Report.getActiveItem().setException(t);
		throw new SkipException("Skipping Test on exception", t);
	}
	
    /**************************************************************************************
	 * Save a screenshot of the current page to a file and add a step to the report.
	 * This will only work if the used Driver will support taking screenshots.
	 * 
     **************************************************************************************/ 
	public static void saveScreenshot(String title){
		Report.takeScreenshot();	
	}
	
    /**************************************************************************************
	 * Save the current HTML source to a file and add a step to the report.
	 * 
     **************************************************************************************/ 
	public static void saveHTML(String stepTitle){
		Report.saveHTMLSource();
	}

    /**************************************************************************************
	 * Executes a TestNG assert with and saves HTML/Screenshot in case the assertion 
	 * fails.
	 * 
     **************************************************************************************/  
	public static void assertFalse(Boolean condition, String message){
		TAU.assertEquals( new Boolean(condition), false, message, false);
		
	}
	
    /**************************************************************************************
	 * Executes a TestNG assert and saves HTML/Screenshot in case the assertion 
	 * fails.
	 * 
     **************************************************************************************/  
	public static void assertTrue(Boolean condition, String message){
		TAU.assertEquals( new Boolean(condition), true, message, false);
	}
	
    /**************************************************************************************
	 * Executes a TestNG assert and saves HTML/Screenshot in case the assertion 
	 * fails.
	 * 
     **************************************************************************************/  
	public static void assertEquals(Object actual, Object expected, String message){
		TAU.assertEquals(actual, expected, message,  false);
	}
	
    /**************************************************************************************
	 * Executes a TestNG assert and saves HTML/Screenshot in case the assertion 
	 * fails.
	 * 
     **************************************************************************************/  
	private static void assertEquals(Object actual, Object expected, String message, boolean softAssert){
		
		StringBuffer description = new StringBuffer();
		description.append("<ul>");
		description.append("<li><strong>Message:&nbsp;</strong> "+message+"</li>");
		description.append("<li><strong>Actual:&nbsp;</strong> ["+actual+"]</li>");
		description.append("<li><strong>Expected:&nbsp;</strong> ["+expected+"]</li>");
		description.append("</ul>");
		
		TAU.startAssert(message).setDescription(description.toString());
		
		try{
			
			if(!softAssert){
				Assert.assertEquals( actual, expected, message);
			}else{
				getSoftAssert().assertEquals(actual, expected, message);
				Report.takeScreenshot();
			}
			
		}catch(AssertionError e){
			TAU.onExceptionActions(e, false);
			
			throw e;
		}finally{
			TAU.endAssert(message);
		}
		
		
	}
	
    /**************************************************************************************
	 * Executes a TestNG softAssert and saves HTML/Screenshot in case the assertion 
	 * fails.
	 * 
     **************************************************************************************/  
	public static void softAssertFalse(Boolean condition, String message){
		TAU.assertEquals( new Boolean(condition), false, message, true);
		
	}
	
    /**************************************************************************************
	 * Executes a TestNG softAssert and saves HTML/Screenshot in case the assertion 
	 * fails.
	 * 
     **************************************************************************************/  
	public static void softAssertTrue(Boolean condition, String message){
		TAU.assertEquals( new Boolean(condition), true, message, true);
	}
	
    /**************************************************************************************
	 * Executes a TestNG softAssert and saves HTML/Screenshot in case the assertion 
	 * fails.
	 * 
     **************************************************************************************/  
	public static void softAssertEquals(Object actual, Object expected, String message){
		TAU.assertEquals(actual, expected, message,  true);
	}
	
    /**************************************************************************************
	 * Execute the assertAll() method of the softAssert instance.
	 * 
     **************************************************************************************/  
	public static void softAssertAll(){
		
		TAU.startAssert("SoftAssert.assertAll()");
		
		try{
			getSoftAssert().assertAll();
			
		}catch(AssertionError e){
			TAU.onExceptionActions(e, false);
			
			throw e;
		}finally{
			TAU.endAssert("SoftAssert.assertAll()");
		}
	}
	
    /**************************************************************************************
	 * Default actions when a java exception is thrown during the execution of the 
	 * automated tests, marks the test as skipped.
	 * 
     **************************************************************************************/ 
	public static void onExceptionActions(Throwable e, String xpath) {
		
		if(e instanceof ElementNotVisibleException
		|| e instanceof InvalidElementStateException){
			String errorTitle = "Info on "+e.getClass().getSimpleName();
			String innerHTML = "Inner HTML of the element: \n"+Driver.getInnerHTML(xpath);
			
			logger.warning(errorTitle);
			logger.warning(innerHTML);
			Report.addErrorMessage(errorTitle, innerHTML, e);
			
		}
		
		TAU.debugXpath(xpath);
		
		onExceptionActions(e, true);
		
	}
	
    /**************************************************************************************
	 * Default actions when a java exception is thrown during the execution of the 
	 * automated tests.
	 * 
     **************************************************************************************/ 
	public static void onExceptionActions(Throwable t, boolean skipTest) {
		TAU.defaultPageChecks();
		TAU.saveHTML("after "+t.getClass().getSimpleName());
		TAU.saveScreenshot("after "+t.getClass().getSimpleName());
		
		Report.getActiveItem().setException(t).setStatus(ItemStatus.Fail);
		
		if(skipTest){
			TAU.setTestSkipped(t);
		}
		
	}
	
    /**************************************************************************************
	 * Prints out information for all elements found for the given xpath for debugging.
	 * Do only use this method for debugging purposes and remove it afterwards.
	 * 
     **************************************************************************************/ 
	public static void debugXpath(String xpath){
	
		int i = 1;
		
		StackTraceElement callingMethod = Thread.currentThread().getStackTrace()[2];
		
		StringBuffer debugInfo = new StringBuffer();

		debugInfo.append("Xpath to Debug: '"+xpath+"'\n");
		debugInfo.append("debugXpath() Called by: '"+callingMethod+"'\n");

		List<WebElement> elements = Driver.findElements(xpath);
		
		if(elements.isEmpty()){
			debugInfo.append("NO ELEMENTS FOUND FOR THE GIVEN XPATH!!!\n");
		}else{
			for(WebElement element : elements){
				debugInfo.append("\n");
				debugInfo.append("\n============ "+i+". Element ============ ");
				debugInfo.append("\nTagName: \t'"	+element.getTagName()+"'");
				debugInfo.append("\nID: \t\t'"		+element.getAttribute("id")+"'");
				debugInfo.append("\nClass: \t\t'"	+element.getAttribute("class")+"'");
				debugInfo.append("\nStyle: \t\t'"	+element.getAttribute("style")+"'");
				debugInfo.append("\nValue: \t\t'"	+element.getAttribute("value")+"'");
				debugInfo.append("\nng-click: \t\'"+element.getAttribute("ng-click")+"'");
				debugInfo.append("\nng-bind: \t\'"	+element.getAttribute("ng-bind")+"'");
				debugInfo.append("\nng-model: \t\'"+element.getAttribute("ng-model")+"'");
				debugInfo.append("\nng-controller:\t'"+element.getAttribute("ng-controller")+"'");
				debugInfo.append("\nSize: \t\t'width:"	+element.getSize().width+", height:"+element.getSize().height+"'");
				debugInfo.append("\nisDisplayed(): \t'"+element.isDisplayed()+"'");
				debugInfo.append("\nisEnabled(): \t'"+element.isEnabled()+"'");
				debugInfo.append("\ninnerHTML: \t\'"+element.getAttribute("innerHTML")+"'");
				
				i++;
			}
		}
		
		Report.addInfoMessage("DEBUG XPATH", "\n"+debugInfo.toString());
		
		System.err.println("################################################################");
		System.err.println("#                   START DEBUG XPATH                          #");
		System.err.println("################################################################");
		
		System.err.println(debugInfo.toString());
				
		System.err.println("################################################################");
		System.err.println("#                     END DEBUG XPATH                          #");
		System.err.println("################################################################");
		System.err.flush();
		
	}
}
