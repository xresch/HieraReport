package com.hierareport.utils;

import java.awt.Dimension;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.concurrent.TimeUnit;
import java.util.logging.Logger;

import com.hierareport.reporter.Report;
import com.hierareport.reporter.ReportItem.ItemType;

public class Driver {

    private static ThreadLocal<WebDriver> THREAD_LOCAL_INSTANCE = new ThreadLocal<WebDriver>();
    private static final Logger logger = Logger.getLogger(Driver.class.getName());
    
    /**************************************************************************************
     * Initialize the static driver instance with the given WebDriver instance.
     * 
     * @param webDriver
     *  
     **************************************************************************************/
    public static WebDriver instance() {
    	
        if (THREAD_LOCAL_INSTANCE.get() != null) {
            return THREAD_LOCAL_INSTANCE.get();
        } else {
            throw new IllegalStateException("WebDriver not initialized");
        }
    }

    /**************************************************************************************
     * Initialize the static driver instance with the given WebDriver instance.
     * 
     * @param driver
     *  
     **************************************************************************************/
    public static void initialize(WebDriver driver) {
    	
    	Report.setDriver(driver);
    	
        synchronized (Driver.class) {
            if (THREAD_LOCAL_INSTANCE.get() == null) {
            	
            	//set fixed size to get more consistent behaviour between different drivers (e.g. fixes issues with PhantomJS you don't have in IE)
            	if(Config.doResizeBrowser()){
	            	driver.manage().window().setSize(new Dimension(Config.browserWidth(),Config.browserHeight()));
	            	logger.info("Set driver window size to width='"+Config.browserWidth()+"' and height='"+Config.browserHeight()+"'");
            	}
            	
                THREAD_LOCAL_INSTANCE.set(driver);
            } else {
                throw new IllegalStateException("WebDriver already initialized");
            }
        }
    }

    /**************************************************************************************
     * Release the driver instance.
     * 
     **************************************************************************************/
    public static void release() {
        synchronized (Driver.class) {
            if (THREAD_LOCAL_INSTANCE.get() != null) {
            	THREAD_LOCAL_INSTANCE.get().close();
            	THREAD_LOCAL_INSTANCE.get().quit();
                THREAD_LOCAL_INSTANCE.set(null);
            } else {
                throw new IllegalStateException("WebDriver not initialized");
            }
        }
    }

    /**************************************************************************************
     * Check if an element is currently on the page.
     *  
     * @param xpath
     * @return true if element is present, false otherwise
     * 
     **************************************************************************************/
    public static boolean isElementOnPage(String xpath) {
        
    	if( ! Driver.findElements(xpath).isEmpty() ){
    		return true;
    	}else{
    		return false;
    	}
    }
    
    /**************************************************************************************
     * Check if an element is inside another element.
     *  
     * @param parent the parent element to search in
     * @param xpath
     * @return true if element is present, false otherwise
     * 
     **************************************************************************************/
    public static boolean isElementinElement(WebElement parent, String xpath) {
        
    	if( parent != null &&
    	  ! Driver.findElements(parent, xpath).isEmpty() ){
    		return true;
    	}else{
    		return false;
    	}
    }
    
    /**************************************************************************************
     * Find an element, in case of a NoSuchElementException do defaultPageCkecks,
     * save the HTML and a screenshot.
     *  
     * @param xpath
     * @throws NoSuchElementException when the element could not be found
     * 
     **************************************************************************************/
    public static WebElement findElement(String xpath){
    	
    	try{
    		return instance().findElement(By.xpath(xpath));
    	}catch(Exception e){
    		TAU.onExceptionActions(e, xpath);
    		throw e;
    	}
    	
    	
    }
    
    
    /**************************************************************************************
     * Find all the elements matching the given XPath, this method will not throw a 
     * NoSuchElementException when the element is not found, it will return an empty list.
     *  
     * @param xpath
     * 
     **************************************************************************************/
    public static List<WebElement> findElements(String xpath){
    	return instance().findElements(By.xpath(xpath));
    }
    
    /**************************************************************************************
     * Find all the elements matching the given XPath, this method will not throw a 
     * NoSuchElementException when the element is not found, it will return an empty list.
     *  
     * @param parent the parent element to search in
     * @param xpath
     * 
     **************************************************************************************/
    public static List<WebElement> findElements(WebElement parent, String xpath){
    	return parent.findElements(By.xpath(xpath));
    }
    
    
    /**************************************************************************************
     * Get an element from the page.
     *  
     * @param xpath
     * @throws NoSuchElementException when the element could not be found
     * 
     **************************************************************************************/
    public static WebElement getElement(String xpath) {

    	return Driver.findElement(xpath);
    }
    
    /**************************************************************************************
     * Get an element from the page.
     * 
     * @param parent the parent element to search in
     * @param xpath
     * @throws NoSuchElementException when the element could not be found
     * 
     **************************************************************************************/
    public static WebElement getElement(WebElement parent, String xpath) {
    	try{
    		if(parent != null){
    			return parent.findElement(By.xpath(xpath));
    		}else{
    			Report.addErrorMessage("The element provided was null", "You can't do that, fix it.");
    			return null;
    		}
    	}catch(Exception e){
    		TAU.onExceptionActions(e, xpath);
    		throw e;
    	}
    	
    }
    
    
    /**************************************************************************************
     * Click an element, this method will only work when the element is visible.
     *  
     * @param xpath
     * @throws NoSuchElementException when the element could not be found
     * 
     **************************************************************************************/
    public static void clickElement(String xpath) {
    	try{
    		getElement(xpath).click();
    	}catch(Exception e){
    		TAU.onExceptionActions(e, xpath);
    		throw e;
    	}
    }
    
    
    /**************************************************************************************
     * Click an element, this method will only work when the element is visible and create 
     * a step in the report.
     *  
     * @param xpath
     * @param stepTitle
     * @throws NoSuchElementException when the element could not be found
     * 
     **************************************************************************************/
    public static void clickElement(String xpath, String stepTitle) {
        
    	TAU.startStep(stepTitle).setDescription("clickElement(xpath: '"+xpath+"')");
    	
    		clickElement(xpath);
    		TAU.defaultPageChecks();
    		
        TAU.endStep(stepTitle);

    }
    
    /**************************************************************************************
     * Click an element, this method will only work when the element is visible and create 
     * a step in the report.
     * 
     * @param parent the parent element to search in
     * @param xpath
     * @param stepTitle
     * @throws NoSuchElementException when the element could not be found
     * 
     **************************************************************************************/
    public static void clickElement(WebElement parent, String xpath, String stepTitle) {
        
    	TAU.startStep(stepTitle).setDescription("clickElement(xpath: '"+xpath+"')");
    	
    		getElement(parent, xpath).click();
    		TAU.defaultPageChecks();
    		
        TAU.endStep(stepTitle);
        
    }
    
    /**************************************************************************************
     * Click the element even if it is hidden, works as well with visible elements.
     * @param xpath
     *  
     **************************************************************************************/
    public static void clickHiddenElement(String xpath) {
        
    	WebElement element = getElement(xpath);
    	Driver.executeJS("arguments[0].click();", element);
    }
    
    /**************************************************************************************
     * Click the element even if it is hidden and create a step in the report.
     * @param xpath
     * @param stepTitle
     * 
     **************************************************************************************/
    public static void clickHiddenElement(String xpath, String stepTitle) {
    	
    	TAU.startStep(stepTitle).setDescription("clickHiddenElementSafely(xpath: '"+xpath+"')");
    	
	    	clickHiddenElement(xpath);
	        TAU.defaultPageChecks();
        
        TAU.endStep(stepTitle);
        
    }
    
    /**************************************************************************************
     * Returns the innerHTML of the element represented by the xpath.
     * 
     * @param elementXPath the element to grab the innerHTML from
     * 
     **************************************************************************************/
    public static String getInnerHTML(String elementXPath) {
        return Driver.getAttribute("innerHTML", elementXPath).trim();
    }
    
    /**************************************************************************************
     * Returns the innerHTML of the element represented by the xpath.
     * @param parent the parent element to search in
     * @param elementXPath the element to grab the innerHTML from
     **************************************************************************************/
    public static String getInnerHTML(WebElement parent, String elementXPath) {
        return Driver.getAttribute(parent, "innerHTML", elementXPath).trim();
    }
    
    /**************************************************************************************
     * Returns the current value of the input field represented by the xpath.
     * 
     * @param elementXPath the element to grab the value from
     * 
     **************************************************************************************/
    public static String getInputFieldValue(String elementXPath) {
        return Driver.getAttribute("value", elementXPath);
    }
    
    /**************************************************************************************
     * Returns the current value of the input field represented by the xpath.
     * 
     * @param parent the parent element to search in
     * @param elementXPath the element to grab the value from
     * 
     **************************************************************************************/
    public static String getInputFieldValue(WebElement parent, String elementXPath) {
        return Driver.getAttribute(parent, "value", elementXPath);
    }
    
    /**************************************************************************************
     * Clears the current value of an input field and sets a new value.
     * 
     * @param elementXPath the element to set the value on
     * @param value 
     *  
     **************************************************************************************/
    public static void setInputFieldValue(String elementXPath, String value) {
    	
        WebElement inputField = Driver.getElement(elementXPath);
        
        try{
			inputField.clear();
			inputField.sendKeys(value);
			
			// If String was not entered correctly send chars one at the time
			// This is a workaround for a bug in selenium 
			if(!inputField.getAttribute("value").equals(value)){
				inputField.clear();
				for(int i = 0; i < value.length(); i++){
					inputField.sendKeys(value.charAt(i)+"");
				}
			}
        }catch(Exception e){
        	TAU.onExceptionActions(e, elementXPath);
        }
    }
    
    /**************************************************************************************
     * Clears the current value of an input field and sets a new value and create a step in 
     * the report.
     * 
     * @param elementXPath the element to set the value on
     * @param value 
     * @param stepTitle
     *  
     **************************************************************************************/
    public static void setInputFieldValue(String elementXPath, String value, String stepTitle) {
    	
    	TAU.startStep(stepTitle).setDescription("setInputFieldValue(xpath: '"+elementXPath+"', value:"+value+")");
    	
    		setInputFieldValue(elementXPath, value);
		
		TAU.endStep(stepTitle);
    }
    
    /**************************************************************************************
     * Get an attribute from the element represented by the xpath.
     * 
     * @param attribute the name of the attribute
     * @param elementXPath the element to set the value on
     * 
     *  
     **************************************************************************************/
    public static String getAttribute(String attribute, String elementXPath) {
        return getElement(elementXPath).getAttribute(attribute);
    }
    
    /**************************************************************************************
     * Get the text from the element represented by the xpath.
     * 
     * @param elementXPath the element to set the value on
     * 
     *  
     **************************************************************************************/
    public static String getText( String elementXPath) {
        return getElement(elementXPath).getText().trim();
    }
    
    /**************************************************************************************
     * Get an attribute from the element represented by the xpath.
     * @param parent the parent element to search in
     * @param attribute the name of the attribute
     * @param elementXPath the element to set the value on
     *  
     **************************************************************************************/
    public static String getAttribute(WebElement parent, String attribute, String elementXPath) {
        return getElement(parent, elementXPath).getAttribute(attribute);
    }
    
    /**************************************************************************************
     * Get the css value from the element represented by the xpath.
     * 
     * @param elementXPath the element to set the value on
     * @param property name 
     * 
     *  
     **************************************************************************************/
    public static String getCssValue(String propertyName, String elementXPath) {
        return getElement(elementXPath).getCssValue(propertyName).trim();
    }
    
    /**************************************************************************************
     * Execute a javascript and add a step to the report.
     * 
     * @param javascript
     * @param arguments
     * 
     **************************************************************************************/    
    public static Object executeJS(String javascript, Object... arguments){
    	TAU.startStep("Execute Javascript").setDescription("Javascript: '"+javascript+"'");
	    	JavascriptExecutor js = (JavascriptExecutor)instance();
	    	Object result = js.executeScript(javascript, arguments);
	    TAU.endStep("Execute Javascript");
	    
	    return result;
    }
      
    
    /**************************************************************************************
     * Wait for the specified milliseconds by using Thread.sleep().
     * 
     * @param millis
     * 
     **************************************************************************************/    
    public static void waitMillis(long millis){
    	
    	try {
			Thread.sleep(millis);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
    }
    
    
    /**************************************************************************************
     * Wait until the page is ready by checking for document.readyState=complete
     * 
     **************************************************************************************/    
	public static void waitForDocumentReady() {
		
		TAU.startStep("[WAIT] For Document Ready State").setType(ItemType.Wait);
		
			try{
				Driver.getDefaultFluentWait()
						.until(new ExpectedCondition<Boolean>() {
							
							@Override
							public Boolean apply(WebDriver driver) {
								return Driver.executeJS("return document.readyState").equals("complete");
							}
						});
				
			}catch(Exception e){
				TAU.onExceptionActions(e, true);
			}
			
		TAU.endStep("[WAIT] For Document Ready State");
			
		TAU.defaultPageChecks();

	}
	
	
    /**************************************************************************************
	 * Wait for a certain element to be displayed on the page.
	 *   
     **************************************************************************************/  
	public static void waitForElementIsDisplayed(final String elementXPath){
		
		TAU.startStep("[WAIT] For Element Is Displayed (xpath:'"+elementXPath+"')").setType(ItemType.Wait);
			
			try{
				Driver.getDefaultFluentWait()
					.until(new ExpectedCondition<Boolean>() {
						
						@Override
						public Boolean apply(WebDriver driver) {
							List<WebElement> loadingIndicatorElements = Driver.findElements(elementXPath);
							for (WebElement webElement : loadingIndicatorElements) {
								if (webElement.isDisplayed()) {
									return true;
								}
							}
			
							return false;
						}
						
					});
			
			}catch(Exception e){
				TAU.onExceptionActions(e, true);
			}
			
		TAU.endStep("[WAIT] For Element Is Displayed (xpath:'"+elementXPath+"')");
		
		TAU.defaultPageChecks();
	}
	
    /**************************************************************************************
	 * Get the default FluentWait 
	 *   
     **************************************************************************************/  
	private static FluentWait<WebDriver> getDefaultFluentWait(){
		
		return new FluentWait<WebDriver>(instance())
					.withTimeout(Config.fluentWaitTimeoutSeconds(), TimeUnit.SECONDS)
					.pollingEvery(Config.waitPollingMillis(), TimeUnit.MILLISECONDS)
					.ignoring(StaleElementReferenceException.class)
					.ignoring(NoSuchElementException.class)
					.ignoring(WebDriverException.class);
	}

	
    /**************************************************************************************
	 * Clear and element.
	 *   
     **************************************************************************************/
	public static void clearElement(String xpath) {
		getElement(xpath).clear();
	}

    /**************************************************************************************
	 * Move to the element.
	 *   
     **************************************************************************************/
	public static void moveToElement(String xpath) {
		Actions action = new Actions(Driver.instance());
		action.moveToElement(Driver.getElement(xpath)).build().perform();
	}

	/**************************************************************************************
	 * Move to the element.
	 *
     **************************************************************************************/
	public static void moveToElement(WebElement element) {
		Actions action = new Actions(Driver.instance());
		action.moveToElement(element).build().perform();
	}
	
}