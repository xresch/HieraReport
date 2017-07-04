package com.hierareport.reporter;

import com.hierareport.reporter.ReportItem.ItemStatus;

/**************************************************************************************
 * A TestNGListener that will be registered with TestNG's @Listeners annotation.
 * This will add ReportItems to the Report for Suites, Classes and Tests.
 * 
 * © Reto Scheiwiller, 2017 - MIT License
 **************************************************************************************/
public class TestNGListener  implements ITestListener, ISuiteListener {
    
	//Used for the workaround that there is no method provided for start and end class
	private boolean classGroupOpen = false;
	
	private String currentSuite = "";
	private String currentClassName = "";

	@Override
	public void onStart(ISuite suite) {
		Report.initialize();
		currentSuite = suite.getName();
		Report.startSuite(currentSuite);

	}
	
	@Override
	public void onStart(ITestContext testContext) {
	}
	
    @Override
	public void onTestStart(ITestResult result) {
		if(classGroupOpen 
		&& !currentClassName.equals(result.getInstance().getClass().getName())){
			Report.endCurrentClass();
			classGroupOpen = false;
    	}
    
		if(!classGroupOpen){
			currentClassName = result.getInstance().getClass().getName();
			Report.startClass(currentClassName);
			classGroupOpen = true;
		}
		Report.startTest(result.getName());
	}
	
    @Override
    public void onTestFailure(ITestResult tr) {
    	
    	Report.getActiveItem().endItem();
    	
    	ReportItem test = Report.endCurrentTest(ItemStatus.Fail);

    	if(test != null && tr.getThrowable() != null){
    		test.setException(tr.getThrowable());
    	}
    }
    
	@Override
	public void onTestFailedButWithinSuccessPercentage(ITestResult result) {
		// TODO Auto-generated method stub
		
	}
    
    @Override
    public void onTestSuccess(ITestResult tr) {
    	Report.endCurrentTest(ItemStatus.Success);

    }
    
    @Override
    public void onTestSkipped(ITestResult tr) {
    	Report.getActiveItem().endItem().setStatus(ItemStatus.Skipped);
    	Report.endCurrentTest(ItemStatus.Skipped);
    }
    
    @Override
    public void onFinish(ITestContext testContext) {
    	classGroupOpen = false;
    	Report.endCurrentClass();
    	
    }
        
	@Override
	public void onFinish(ISuite suite) {
    	Report.endCurrentSuite();
    	Report.createFinalReport();
	}
    
}