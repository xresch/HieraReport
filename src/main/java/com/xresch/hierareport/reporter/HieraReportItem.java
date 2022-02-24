package com.xresch.hierareport.reporter;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;

/**************************************************************************************
 * The ReportItem contains all the information of the report in a hierachical tree
 * structure. It will be serialized to json so it can be loaded and displayed by the 
 * browser part of HieraReport.
 * 
 * Copyright Reto Scheiwiller, 2017 - MIT License
 **************************************************************************************/

public class HieraReportItem {

	private transient static SimpleDateFormat formatter = new SimpleDateFormat("YYYY-MM-dd'T'HH:mm:ss.SSS");
	
	private transient long startNanos;
	private transient HieraReportItem parent = null;
	
	private String timestamp;
	private int itemNumber;
	private String title = "";
	private String description = null;
	private String url = null;
	private String exceptionMessage = null;
	private String exceptionStacktrace = null;
	private String screenshotPath = null;
	private String sourcePath = null;
	private long duration = 0;
	private ItemType type = null;
	private ItemStatus status = ItemStatus.Success;
	private ArrayList<HieraReportItem> children = new ArrayList<HieraReportItem>();
	
	public enum ItemType {Suite, Class, Test, Step, MessageInfo, MessageWarn, MessageError, Wait, Assert }
	public enum ItemStatus { Undefined, Success, Fail, Skipped, Aborted }
	
	private static ThreadLocal<Integer> itemCount = new ThreadLocal<Integer>();
	private static Object itemCountLock = new Object();
	
	static{
		itemCount.set(1);
	}
	
	public HieraReportItem(ItemType type, String title){
		this.type = type;
		this.title = title;
		this.timestamp = formatter.format(new Date());
		this.startNanos = System.nanoTime();
		calculateItemNumber();
	}
	
	
	public HieraReportItem endItem(){
		
		long endNanos = System.nanoTime();
		duration = (endNanos - startNanos) / 1000000;
		
		return this;
		
	}
	
	private void calculateItemNumber(){
		synchronized (itemCountLock) {
			
			if(itemCount.get() == null) itemCount.set(1);
			
			itemNumber = itemCount.get();
			itemNumber++;
			itemCount.set(itemNumber);
		}
	}
	
	protected static void resetItemCounter(){
		synchronized (itemCountLock) {
			itemCount.set(1);
		}
	}

	public String getFixSizeNumber() {
	
		StringBuffer fixedLenght = new StringBuffer("");
		for(int i=0; i < 4-(itemNumber+"").length(); i++){
			fixedLenght.append("0");
		}
		
		fixedLenght.append(itemNumber);
		return fixedLenght.toString();
	}
	
	public int getItemNumber() {
		return itemNumber;
	}
	
	public HieraReportItem setItemNumber(int stepNumber) {
		this.itemNumber = stepNumber;
		return this;
	}
	
	public long getDuration() {
		return duration;
	}

	public HieraReportItem setDuration(long duration) {
		this.duration = duration;
		return this;
	}

	public String getTitle() {
		return title;
	}

	public HieraReportItem setTitle(String title) {
		this.title =  escapeIt(title);
		return this;
	}

	public String getDescription() {
		return description;
	}

	public HieraReportItem setDescription(String description) {
		this.description =  escapeIt(description);
		return this;
	}

	
	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url =  escapeIt(url);
	}

	public String getExceptionStacktrace() {
		return exceptionStacktrace;
	}

	public void setExceptionStacktrace(String exceptionStacktrace) {
		this.exceptionStacktrace =  escapeIt(exceptionStacktrace);
	}

	public String getExceptionMessage() {
		return exceptionMessage;
	}

	public HieraReportItem setExceptionMessage(String exceptionMessage) {
		this.exceptionMessage =  escapeIt(exceptionMessage);
		return this;
	}
	
	public HieraReportItem setException(Throwable e) {
		
		StringBuffer stacktrace = new StringBuffer(); 
		for(StackTraceElement element : e.getStackTrace()){
			stacktrace.append(element.toString());
			stacktrace.append("\n");
		}

		this.exceptionMessage =  escapeIt(e.getMessage());
		this.exceptionStacktrace =  escapeIt(stacktrace.toString());
		return this;
	}

	public ItemType getType() {
		return type;
	}

	public HieraReportItem setType(ItemType type) {
		this.type = type;
		return this;
	}

	public ItemStatus getStatus() {
		return status;
	}

	/***************************************************************************
	 * Set the status of this item.
	 * If the status is set to Fail, Aborted Skipped propagate it up the whole tree.
	 *  
	 * @param status
	 ***************************************************************************/
	public HieraReportItem setStatus(ItemStatus status) {
		
		this.status = status;
		
		if(parent != null){
			
			if(parent.status != ItemStatus.Fail 
			   && (status == ItemStatus.Fail || status == ItemStatus.Aborted || status == ItemStatus.Skipped) ){ 
				
				 parent.setStatus(status);
				 return this;
			}
		
		}
		
		return this;
	}
	
	
	public String getTimestamp() {
		return timestamp;
	}

	public HieraReportItem setTimestamp(String timestamp) {
		this.timestamp = timestamp;
		return this;
	}


	public String getScreenshotPath() {
		return screenshotPath;
	}

	public void setScreenshotPath(String screenshotPath) {
		this.screenshotPath =  escapeIt(screenshotPath);
	}

	public String getSourcePath() {
		return sourcePath;
	}

	public void setSourcePath(String sourcePath) {
		this.sourcePath = escapeIt(sourcePath);
	}
	
	public HieraReportItem getParent() {
		return parent;
	}
	
	/***********************************************************************************
	 * Returns the first element in the hierarchy from bottom up
	 * which is of the specified type
	 * 
	 * @param item
	 * @param type
	 * @return
	 ***********************************************************************************/
	public static HieraReportItem getFirstElementWithType(HieraReportItem item, ItemType type) {
		
		if(item.getType().equals(type)){
			return item;
		}else{
			if(item.getParent() == null){
				return null;
			}else{
				return HieraReportItem.getFirstElementWithType(item.getParent(), type);
			}
		}

	}

	public void setParent(HieraReportItem parent) {
		this.parent = parent;
		parent.appendChild(this);
	}

	public ArrayList<HieraReportItem> getChildren() {
		return children;
	}

	public HieraReportItem setChildren(ArrayList<HieraReportItem> children) {
		this.children = children;
		return this;
	}
	
	public void appendChild(HieraReportItem child) {
		if(child.getParent() == null || !child.getParent().equals(this)){
			child.setParent(this);
		}
		children.add(child);
	}
	
	public int getLevel() {
		
		if(this.parent != null){
			return parent.getLevel()+1;
		}else{
			return 1;
		}
		
	}
	
	public boolean hasChildren(HieraReportItem child) {
		
		return !children.isEmpty();
	}
	
	private static String escapeIt(String string) {
        String escapes[][] = new String[][]{
                {"\n", "<br>"},
                {"\r\n", "<br>"},
                {"\f", "<br>"},
                {"\t", "&nbsp;"}
        };
        for (String[] esc : escapes) {
            string = string.replace(esc[0], esc[1]);
        }
        return string;
	}
}	
