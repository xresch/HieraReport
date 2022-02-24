package com.xresch.hierareport.reporter;

import org.junit.platform.engine.TestExecutionResult;
import org.junit.platform.engine.TestExecutionResult.Status;
import org.junit.platform.engine.reporting.ReportEntry;
import org.junit.platform.launcher.TestExecutionListener;
import org.junit.platform.launcher.TestIdentifier;
import org.junit.platform.launcher.TestPlan;

import com.xresch.hierareport.reporter.HieraReportItem.ItemStatus;

public class HieraReportJUnitPlatformListener implements TestExecutionListener {

	// Checkout this: https://www.swtestacademy.com/reporting-test-results-tesults-junit5-jupiter/
	
	TestPlan currentTestplan;
	/**
	 * Called when the execution of the {@link TestPlan} has started,
	 * <em>before</em> any test has been executed.
	 *
	 * @param testPlan describes the tree of tests about to be executed
	 */
	public void testPlanExecutionStarted(TestPlan testplan) {
		currentTestplan = testplan;
		HieraReport.configCloseCheckSuite(false);
		HieraReport.configCloseCheckClass(false);
		HieraReport.initialize();
	}

	/**
	 * Called when the execution of the {@link TestPlan} has finished,
	 * <em>after</em> all tests have been executed.
	 *
	 * @param testPlan describes the tree of tests that have been executed
	 */
	public void testPlanExecutionFinished(TestPlan testplan) {
		
		HieraReport.createFinalReport();
	}

	/**
	 * Called when a new, dynamic {@link TestIdentifier} has been registered.
	 *
	 * <p>A <em>dynamic test</em> is a test that is not known a-priori and
	 * therefore not contained in the original {@link TestPlan}.
	 *
	 * @param testIdentifier the identifier of the newly registered test
	 * or container
	 */
	public void dynamicTestRegistered(TestIdentifier testIdentifier) {
	}

	/**
	 * Called when the execution of a leaf or subtree of the {@link TestPlan}
	 * has been skipped.
	 *
	 * <p>The {@link TestIdentifier} may represent a test or a container. In
	 * the case of a container, no listener methods will be called for any of
	 * its descendants.
	 *
	 * <p>A skipped test or subtree of tests will never be reported as
	 * {@linkplain #executionStarted started} or
	 * {@linkplain #executionFinished finished}.
	 *
	 * @param testIdentifier the identifier of the skipped test or container
	 * @param reason a human-readable message describing why the execution
	 * has been skipped
	 */
	public void executionSkipped(TestIdentifier testIdentifier, String reason) {
		
		System.out.println("================ SKIPPED =====================");
		ResolvedIdentifiers resolved = resolveIdentifiers(testIdentifier);
		//---------------------------------------
		// Start Test
		if (resolved.methodName != null) {
			HieraReport.startTest(resolved.methodName);
		    HieraReport.endCurrentTest(ItemStatus.Skipped);
		}
	}

	/**
	 * Called when the execution of a leaf or subtree of the {@link TestPlan}
	 * is about to be started.
	 *
	 * <p>The {@link TestIdentifier} may represent a test or a container.
	 *
	 * <p>This method will only be called if the test or container has not
	 * been {@linkplain #executionSkipped skipped}.
	 *
	 * <p>This method will be called for a container {@code TestIdentifier}
	 * <em>before</em> {@linkplain #executionStarted starting} or
	 * {@linkplain #executionSkipped skipping} any of its children.
	 *
	 * @param testIdentifier the identifier of the started test or container
	 */
	public void executionStarted(TestIdentifier testIdentifier) {

		// ParentID Examples 
		// If element is a class:   [engine:junit-jupiter]
		// If element is a method: [engine:junit-jupiter]/[class:com.xresch.cfw.tests.features.query.TestCFWQueryExecution]
		
		//---------------------------------------
		// Ignore if no parent id is found
		if(!testIdentifier.getParentId().isPresent()) {
			return;
		}
		
		ResolvedIdentifiers resolved = resolveIdentifiers(testIdentifier);
		
		//---------------------------------------
		// Start Suite
		if (resolved.suite != null) {
		    HieraReport.startSuite(resolved.suite);
		}
		 
		//---------------------------------------
		// Start Class
		if (resolved.className != null) {
		    HieraReport.startClass(resolved.className);
		}
		
		//---------------------------------------
		// Start Test
		if (resolved.methodName != null) {
		    HieraReport.startTest(resolved.methodName);
		}
}

	/**
	 * Called when the execution of a leaf or subtree of the {@link TestPlan}
	 * has finished, regardless of the outcome.
	 *
	 * <p>The {@link TestIdentifier} may represent a test or a container.
	 *
	 * <p>This method will only be called if the test or container has not
	 * been {@linkplain #executionSkipped skipped}.
	 *
	 * <p>This method will be called for a container {@code TestIdentifier}
	 * <em>after</em> all of its children have been
	 * {@linkplain #executionSkipped skipped} or have
	 * {@linkplain #executionFinished finished}.
	 *
	 * <p>The {@link TestExecutionResult} describes the result of the execution
	 * for the supplied {@code TestIdentifier}. The result does not include or
	 * aggregate the results of its children. For example, a container with a
	 * failing test will be reported as {@link Status#SUCCESSFUL SUCCESSFUL} even
	 * if one or more of its children are reported as {@link Status#FAILED FAILED}.
	 *
	 * @param testIdentifier the identifier of the finished test or container
	 * @param testExecutionResult the (unaggregated) result of the execution for
	 * the supplied {@code TestIdentifier}
	 *
	 * @see TestExecutionResult
	 */
	public void executionFinished(TestIdentifier testIdentifier, TestExecutionResult testExecutionResult) {
		//---------------------------------------
		// Ignore if no parent id is found
		if(!testIdentifier.getParentId().isPresent()) {
			return;
		}
		
		currentTestplan.getChildren(testIdentifier.getParentId().get());
		
		System.out.println("================ END =====================");
		ResolvedIdentifiers resolved = resolveIdentifiers(testIdentifier);
		
		if (resolved.methodName != null) {
			//---------------------------------------
			// End Test
			switch(testExecutionResult.getStatus()) {
			case ABORTED: 		HieraReport.endCurrentTest(ItemStatus.Aborted); break;
			case FAILED:		HieraReport.endCurrentTest(ItemStatus.Fail); break;
			case SUCCESSFUL:	HieraReport.endCurrentTest(ItemStatus.Success); break;
			default:
				break;
			
			}

		    return;
		}else if(resolved.className != null) {
			
			HieraReport.endCurrentClass();
			return;
		}
		
		//---------------------------------------
		// End Suite
		if (resolved.suite != null) {
		    HieraReport.endCurrentSuite();
		    return;
		}
		 
	}

	/*****************************************************************************************
	 * Called when additional test reporting data has been published for
	 * the supplied {@link TestIdentifier}.
	 *
	 * <p>Can be called at any time during the execution of a test plan.
	 *
	 * @param testIdentifier describes the test or container to which the entry pertains
	 * @param entry the published {@code ReportEntry}
	 *****************************************************************************************/
	public void reportingEntryPublished(TestIdentifier testIdentifier, ReportEntry entry) {
	}
	
	
	
	/*****************************************************************************************
	 * 
	 *****************************************************************************************/
	public ResolvedIdentifiers resolveIdentifiers(TestIdentifier testIdentifier) {
		
		ResolvedIdentifiers resolved = new ResolvedIdentifiers();
		
		//---------------------------------------
		// Ignore if no parent id is found
		if(!testIdentifier.getParentId().isPresent()) {
			return resolved;
		}
		
		String parentID = testIdentifier.getParentId().get();
		
         //---------------------------------------
		 // Find Suite
         
         String suiteSeparator = "engine:";
         if (parentID.contains("engine:")) {
             int beginIndex = parentID.indexOf(suiteSeparator) + suiteSeparator.length();
             resolved.suite = parentID.substring(beginIndex, parentID.indexOf("]", beginIndex));
         }
         
         //---------------------------------------
		 // Find Class Name
         String classSeparator = "class:";
         if (parentID.contains("class:")) {
             int beginIndex = parentID.indexOf(classSeparator) + classSeparator.length();
             resolved.className = parentID.substring(beginIndex, parentID.indexOf("]", beginIndex));
         }
         
         //---------------------------------------
		 // Find Method Name

         if(resolved.className != null) {
        	 String methodName = testIdentifier.getDisplayName();
        	 if (methodName.indexOf("(") != -1) {
        		 methodName = methodName.substring(0, methodName.lastIndexOf("("));
             }
        	 resolved.methodName = methodName;
        	 
         }
         
         System.out.println("suite:"+resolved.suite);
         System.out.println("className:"+resolved.className);
         System.out.println("testname:"+resolved.methodName);
         System.out.println("TestIdentifierParent: "+testIdentifier.getParentId().get());
         
         return resolved;
	}
	
	private class ResolvedIdentifiers {
		
		protected String suite = null;
		protected String className = null;
		protected String methodName = null;
	}
	

}
