DATA = DATA.concat([
  {
    "itemNumber": 1,
    "title": "Default suite",
    "url": "about:blank",
    "duration": 73767,
    "type": "Suite",
    "status": "Fail",
    "children": [
      {
        "itemNumber": 3,
        "title": "com.reporter.example.TestPrototype",
        "url": "about:blank",
        "duration": 64759,
        "type": "Class",
        "status": "Fail",
        "children": [
          {
            "itemNumber": 1,
            "title": "debug_xpath_test",
            "url": "about:blank",
            "duration": 20130,
            "type": "Test",
            "status": "Success",
            "children": [
              {
                "itemNumber": 1,
                "title": "Debug XPath",
                "description": "",
                "url": "about:blank",
                "duration": 20066,
                "type": "Step",
                "status": "Success",
                "children": [
                  {
                    "itemNumber": 2,
                    "title": "DEBUG XPATH",
                    "description": "<br>Xpath to Debug: '//div[@class='not_there']'<br>debugXpath() Called by: 'com.reporter.example.TestPrototype.debug_xpath_test(TestPrototype.java:73)'<br>NO ELEMENTS FOUND FOR THE GIVEN XPATH!!!<br>",
                    "duration": 0,
                    "type": "MessageInfo",
                    "status": "Undefined",
                    "children": []
                  }
                ]
              }
            ]
          },
          {
            "itemNumber": 2,
            "title": "mark_test_as_failed",
            "url": "about:blank",
            "exceptionMessage": "is always failing expected [true] but found [false]",
            "exceptionStacktrace": "org.testng.Assert.fail(Assert.java:94)<br>org.testng.Assert.failNotEquals(Assert.java:513)<br>org.testng.Assert.assertEqualsImpl(Assert.java:135)<br>org.testng.Assert.assertEquals(Assert.java:116)<br>com.reporter.example.utils.TAU.assertEquals(TAU.java:393)<br>com.reporter.example.utils.TAU.assertTrue(TAU.java:372)<br>com.reporter.example.TestPrototype.mark_test_as_failed(TestPrototype.java:106)<br>sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)<br>sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:57)<br>sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)<br>java.lang.reflect.Method.invoke(Method.java:606)<br>org.testng.internal.MethodInvocationHelper.invokeMethod(MethodInvocationHelper.java:86)<br>org.testng.internal.Invoker.invokeMethod(Invoker.java:643)<br>org.testng.internal.Invoker.invokeTestMethod(Invoker.java:820)<br>org.testng.internal.Invoker.invokeTestMethods(Invoker.java:1128)<br>org.testng.internal.TestMethodWorker.invokeTestMethods(TestMethodWorker.java:129)<br>org.testng.internal.TestMethodWorker.run(TestMethodWorker.java:112)<br>org.testng.TestRunner.privateRun(TestRunner.java:782)<br>org.testng.TestRunner.run(TestRunner.java:632)<br>org.testng.SuiteRunner.runTest(SuiteRunner.java:366)<br>org.testng.SuiteRunner.runSequentially(SuiteRunner.java:361)<br>org.testng.SuiteRunner.privateRun(SuiteRunner.java:319)<br>org.testng.SuiteRunner.run(SuiteRunner.java:268)<br>org.testng.SuiteRunnerWorker.runSuite(SuiteRunnerWorker.java:52)<br>org.testng.SuiteRunnerWorker.run(SuiteRunnerWorker.java:86)<br>org.testng.TestNG.runSuitesSequentially(TestNG.java:1244)<br>org.testng.TestNG.runSuitesLocally(TestNG.java:1169)<br>org.testng.TestNG.run(TestNG.java:1064)<br>org.testng.remote.AbstractRemoteTestNG.run(AbstractRemoteTestNG.java:132)<br>org.testng.remote.RemoteTestNG.initAndRun(RemoteTestNG.java:236)<br>org.testng.remote.RemoteTestNG.main(RemoteTestNG.java:81)<br>",
            "duration": 20851,
            "type": "Test",
            "status": "Fail",
            "children": [
              {
                "itemNumber": 1,
                "title": "0100_AssertFalse(NOT ENDED PROPERLY)",
                "duration": 20845,
                "type": "Step",
                "status": "Fail",
                "children": [
                  {
                    "itemNumber": 2,
                    "title": "[Assert] is always failing",
                    "description": "<ul><li><strong>Message:&nbsp;</strong> is always failing</li><li><strong>Actual:&nbsp;</strong> [false]</li><li><strong>Expected:&nbsp;</strong> [true]</li></ul>",
                    "url": "about:blank",
                    "exceptionMessage": "is always failing expected [true] but found [false]",
                    "exceptionStacktrace": "org.testng.Assert.fail(Assert.java:94)<br>org.testng.Assert.failNotEquals(Assert.java:513)<br>org.testng.Assert.assertEqualsImpl(Assert.java:135)<br>org.testng.Assert.assertEquals(Assert.java:116)<br>com.reporter.example.utils.TAU.assertEquals(TAU.java:393)<br>com.reporter.example.utils.TAU.assertTrue(TAU.java:372)<br>com.reporter.example.TestPrototype.mark_test_as_failed(TestPrototype.java:106)<br>sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)<br>sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:57)<br>sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)<br>java.lang.reflect.Method.invoke(Method.java:606)<br>org.testng.internal.MethodInvocationHelper.invokeMethod(MethodInvocationHelper.java:86)<br>org.testng.internal.Invoker.invokeMethod(Invoker.java:643)<br>org.testng.internal.Invoker.invokeTestMethod(Invoker.java:820)<br>org.testng.internal.Invoker.invokeTestMethods(Invoker.java:1128)<br>org.testng.internal.TestMethodWorker.invokeTestMethods(TestMethodWorker.java:129)<br>org.testng.internal.TestMethodWorker.run(TestMethodWorker.java:112)<br>org.testng.TestRunner.privateRun(TestRunner.java:782)<br>org.testng.TestRunner.run(TestRunner.java:632)<br>org.testng.SuiteRunner.runTest(SuiteRunner.java:366)<br>org.testng.SuiteRunner.runSequentially(SuiteRunner.java:361)<br>org.testng.SuiteRunner.privateRun(SuiteRunner.java:319)<br>org.testng.SuiteRunner.run(SuiteRunner.java:268)<br>org.testng.SuiteRunnerWorker.runSuite(SuiteRunnerWorker.java:52)<br>org.testng.SuiteRunnerWorker.run(SuiteRunnerWorker.java:86)<br>org.testng.TestNG.runSuitesSequentially(TestNG.java:1244)<br>org.testng.TestNG.runSuitesLocally(TestNG.java:1169)<br>org.testng.TestNG.run(TestNG.java:1064)<br>org.testng.remote.AbstractRemoteTestNG.run(AbstractRemoteTestNG.java:132)<br>org.testng.remote.RemoteTestNG.initAndRun(RemoteTestNG.java:236)<br>org.testng.remote.RemoteTestNG.main(RemoteTestNG.java:81)<br>",
                    "screenshotPath": ".//0002_mark_test_as_failed/screenshots/0002_Screenshot__Assert__is_always_failing.html",
                    "sourcePath": ".//0002_mark_test_as_failed/htmlSources/0002_HTML__Assert__is_always_failing.html",
                    "duration": 20796,
                    "type": "Assert",
                    "status": "Fail",
                    "children": []
                  }
                ]
              }
            ]
          },
          {
            "itemNumber": 3,
            "title": "mark_test_as_skipped",
            "url": "about:blank",
            "duration": 397,
            "type": "Test",
            "status": "Skipped",
            "children": [
              {
                "itemNumber": 1,
                "title": "0100_AssertTrue",
                "description": "",
                "url": "about:blank",
                "duration": 379,
                "type": "Step",
                "status": "Success",
                "children": [
                  {
                    "itemNumber": 2,
                    "title": "[Assert] is always true",
                    "description": "<ul><li><strong>Message:&nbsp;</strong> is always true</li><li><strong>Actual:&nbsp;</strong> [true]</li><li><strong>Expected:&nbsp;</strong> [true]</li></ul>",
                    "url": "about:blank",
                    "screenshotPath": ".//0003_mark_test_as_skipped/screenshots/0002_Screenshot__Assert__is_always_true.html",
                    "sourcePath": ".//0003_mark_test_as_skipped/htmlSources/0002_HTML__Assert__is_always_true.html",
                    "duration": 372,
                    "type": "Assert",
                    "status": "Success",
                    "children": []
                  }
                ]
              },
              {
                "itemNumber": 3,
                "title": "0200_MarkSkipped(NOT ENDED PROPERLY)",
                "duration": 5,
                "type": "Step",
                "status": "Fail",
                "children": []
              }
            ]
          },
          {
            "itemNumber": 4,
            "title": "mark_test_as_success",
            "url": "about:blank",
            "duration": 452,
            "type": "Test",
            "status": "Success",
            "children": [
              {
                "itemNumber": 1,
                "title": "0100_AssertTrue",
                "description": "",
                "url": "about:blank",
                "duration": 401,
                "type": "Step",
                "status": "Success",
                "children": [
                  {
                    "itemNumber": 2,
                    "title": "[Assert] is always true",
                    "description": "<ul><li><strong>Message:&nbsp;</strong> is always true</li><li><strong>Actual:&nbsp;</strong> [true]</li><li><strong>Expected:&nbsp;</strong> [true]</li></ul>",
                    "url": "about:blank",
                    "screenshotPath": ".//0004_mark_test_as_success/screenshots/0002_Screenshot__Assert__is_always_true.html",
                    "sourcePath": ".//0004_mark_test_as_success/htmlSources/0002_HTML__Assert__is_always_true.html",
                    "duration": 394,
                    "type": "Assert",
                    "status": "Success",
                    "children": []
                  }
                ]
              }
            ]
          },
          {
            "itemNumber": 5,
            "title": "report_assert_test",
            "url": "about:blank",
            "exceptionMessage": "it failed good dammit expected [true] but found [false]",
            "exceptionStacktrace": "org.testng.Assert.fail(Assert.java:94)<br>org.testng.Assert.failNotEquals(Assert.java:513)<br>org.testng.Assert.assertEqualsImpl(Assert.java:135)<br>org.testng.Assert.assertEquals(Assert.java:116)<br>com.reporter.example.utils.TAU.assertEquals(TAU.java:393)<br>com.reporter.example.utils.TAU.assertTrue(TAU.java:372)<br>com.reporter.example.TestPrototype.report_assert_test(TestPrototype.java:28)<br>sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)<br>sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:57)<br>sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)<br>java.lang.reflect.Method.invoke(Method.java:606)<br>org.testng.internal.MethodInvocationHelper.invokeMethod(MethodInvocationHelper.java:86)<br>org.testng.internal.Invoker.invokeMethod(Invoker.java:643)<br>org.testng.internal.Invoker.invokeTestMethod(Invoker.java:820)<br>org.testng.internal.Invoker.invokeTestMethods(Invoker.java:1128)<br>org.testng.internal.TestMethodWorker.invokeTestMethods(TestMethodWorker.java:129)<br>org.testng.internal.TestMethodWorker.run(TestMethodWorker.java:112)<br>org.testng.TestRunner.privateRun(TestRunner.java:782)<br>org.testng.TestRunner.run(TestRunner.java:632)<br>org.testng.SuiteRunner.runTest(SuiteRunner.java:366)<br>org.testng.SuiteRunner.runSequentially(SuiteRunner.java:361)<br>org.testng.SuiteRunner.privateRun(SuiteRunner.java:319)<br>org.testng.SuiteRunner.run(SuiteRunner.java:268)<br>org.testng.SuiteRunnerWorker.runSuite(SuiteRunnerWorker.java:52)<br>org.testng.SuiteRunnerWorker.run(SuiteRunnerWorker.java:86)<br>org.testng.TestNG.runSuitesSequentially(TestNG.java:1244)<br>org.testng.TestNG.runSuitesLocally(TestNG.java:1169)<br>org.testng.TestNG.run(TestNG.java:1064)<br>org.testng.remote.AbstractRemoteTestNG.run(AbstractRemoteTestNG.java:132)<br>org.testng.remote.RemoteTestNG.initAndRun(RemoteTestNG.java:236)<br>org.testng.remote.RemoteTestNG.main(RemoteTestNG.java:81)<br>",
            "duration": 21207,
            "type": "Test",
            "status": "Fail",
            "children": [
              {
                "itemNumber": 1,
                "title": "Test Assert Success",
                "description": "",
                "url": "about:blank",
                "duration": 379,
                "type": "Step",
                "status": "Success",
                "children": [
                  {
                    "itemNumber": 2,
                    "title": "[Assert] it worked",
                    "description": "<ul><li><strong>Message:&nbsp;</strong> it worked</li><li><strong>Actual:&nbsp;</strong> [true]</li><li><strong>Expected:&nbsp;</strong> [true]</li></ul>",
                    "url": "about:blank",
                    "screenshotPath": ".//0005_report_assert_test/screenshots/0002_Screenshot__Assert__it_worked.html",
                    "sourcePath": ".//0005_report_assert_test/htmlSources/0002_HTML__Assert__it_worked.html",
                    "duration": 373,
                    "type": "Assert",
                    "status": "Success",
                    "children": []
                  }
                ]
              },
              {
                "itemNumber": 3,
                "title": "Test Assert Fails(NOT ENDED PROPERLY)",
                "duration": 20813,
                "type": "Step",
                "status": "Fail",
                "children": [
                  {
                    "itemNumber": 4,
                    "title": "[Assert] it failed good dammit",
                    "description": "<ul><li><strong>Message:&nbsp;</strong> it failed good dammit</li><li><strong>Actual:&nbsp;</strong> [false]</li><li><strong>Expected:&nbsp;</strong> [true]</li></ul>",
                    "url": "about:blank",
                    "exceptionMessage": "it failed good dammit expected [true] but found [false]",
                    "exceptionStacktrace": "org.testng.Assert.fail(Assert.java:94)<br>org.testng.Assert.failNotEquals(Assert.java:513)<br>org.testng.Assert.assertEqualsImpl(Assert.java:135)<br>org.testng.Assert.assertEquals(Assert.java:116)<br>com.reporter.example.utils.TAU.assertEquals(TAU.java:393)<br>com.reporter.example.utils.TAU.assertTrue(TAU.java:372)<br>com.reporter.example.TestPrototype.report_assert_test(TestPrototype.java:28)<br>sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)<br>sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:57)<br>sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)<br>java.lang.reflect.Method.invoke(Method.java:606)<br>org.testng.internal.MethodInvocationHelper.invokeMethod(MethodInvocationHelper.java:86)<br>org.testng.internal.Invoker.invokeMethod(Invoker.java:643)<br>org.testng.internal.Invoker.invokeTestMethod(Invoker.java:820)<br>org.testng.internal.Invoker.invokeTestMethods(Invoker.java:1128)<br>org.testng.internal.TestMethodWorker.invokeTestMethods(TestMethodWorker.java:129)<br>org.testng.internal.TestMethodWorker.run(TestMethodWorker.java:112)<br>org.testng.TestRunner.privateRun(TestRunner.java:782)<br>org.testng.TestRunner.run(TestRunner.java:632)<br>org.testng.SuiteRunner.runTest(SuiteRunner.java:366)<br>org.testng.SuiteRunner.runSequentially(SuiteRunner.java:361)<br>org.testng.SuiteRunner.privateRun(SuiteRunner.java:319)<br>org.testng.SuiteRunner.run(SuiteRunner.java:268)<br>org.testng.SuiteRunnerWorker.runSuite(SuiteRunnerWorker.java:52)<br>org.testng.SuiteRunnerWorker.run(SuiteRunnerWorker.java:86)<br>org.testng.TestNG.runSuitesSequentially(TestNG.java:1244)<br>org.testng.TestNG.runSuitesLocally(TestNG.java:1169)<br>org.testng.TestNG.run(TestNG.java:1064)<br>org.testng.remote.AbstractRemoteTestNG.run(AbstractRemoteTestNG.java:132)<br>org.testng.remote.RemoteTestNG.initAndRun(RemoteTestNG.java:236)<br>org.testng.remote.RemoteTestNG.main(RemoteTestNG.java:81)<br>",
                    "screenshotPath": ".//0005_report_assert_test/screenshots/0004_Screenshot__Assert__it_failed_good_dammit.html",
                    "sourcePath": ".//0005_report_assert_test/htmlSources/0004_HTML__Assert__it_failed_good_dammit.html",
                    "duration": 20759,
                    "type": "Assert",
                    "status": "Fail",
                    "children": []
                  }
                ]
              }
            ]
          },
          {
            "itemNumber": 6,
            "title": "report_message_test",
            "url": "about:blank",
            "duration": 57,
            "type": "Test",
            "status": "Success",
            "children": [
              {
                "itemNumber": 1,
                "title": "Test Info Message",
                "description": "",
                "url": "about:blank",
                "duration": 0,
                "type": "Step",
                "status": "Success",
                "children": [
                  {
                    "itemNumber": 2,
                    "title": "Not so important Information",
                    "description": "Strawberries are sweeter than carrots.",
                    "duration": 0,
                    "type": "MessageInfo",
                    "status": "Undefined",
                    "children": []
                  }
                ]
              },
              {
                "itemNumber": 3,
                "title": "Test Warning Message",
                "description": "",
                "url": "about:blank",
                "duration": 0,
                "type": "Step",
                "status": "Success",
                "children": [
                  {
                    "itemNumber": 4,
                    "title": "ITSA WARNING",
                    "description": "Pay attention it might fail",
                    "duration": 0,
                    "type": "MessageWarn",
                    "status": "Undefined",
                    "children": []
                  }
                ]
              },
              {
                "itemNumber": 5,
                "title": "Test Error Message",
                "description": "",
                "url": "about:blank",
                "duration": 0,
                "type": "Step",
                "status": "Success",
                "children": [
                  {
                    "itemNumber": 6,
                    "title": "Error Message Test",
                    "description": "Some error was thrown.",
                    "duration": 0,
                    "type": "MessageError",
                    "status": "Undefined",
                    "children": []
                  },
                  {
                    "itemNumber": 7,
                    "title": "Error Message Test with Exception",
                    "description": "Some error was thrown.",
                    "exceptionMessage": "This is my excpetion.",
                    "exceptionStacktrace": "com.reporter.example.TestPrototype.report_message_test(TestPrototype.java:63)<br>sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)<br>sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:57)<br>sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)<br>java.lang.reflect.Method.invoke(Method.java:606)<br>org.testng.internal.MethodInvocationHelper.invokeMethod(MethodInvocationHelper.java:86)<br>org.testng.internal.Invoker.invokeMethod(Invoker.java:643)<br>org.testng.internal.Invoker.invokeTestMethod(Invoker.java:820)<br>org.testng.internal.Invoker.invokeTestMethods(Invoker.java:1128)<br>org.testng.internal.TestMethodWorker.invokeTestMethods(TestMethodWorker.java:129)<br>org.testng.internal.TestMethodWorker.run(TestMethodWorker.java:112)<br>org.testng.TestRunner.privateRun(TestRunner.java:782)<br>org.testng.TestRunner.run(TestRunner.java:632)<br>org.testng.SuiteRunner.runTest(SuiteRunner.java:366)<br>org.testng.SuiteRunner.runSequentially(SuiteRunner.java:361)<br>org.testng.SuiteRunner.privateRun(SuiteRunner.java:319)<br>org.testng.SuiteRunner.run(SuiteRunner.java:268)<br>org.testng.SuiteRunnerWorker.runSuite(SuiteRunnerWorker.java:52)<br>org.testng.SuiteRunnerWorker.run(SuiteRunnerWorker.java:86)<br>org.testng.TestNG.runSuitesSequentially(TestNG.java:1244)<br>org.testng.TestNG.runSuitesLocally(TestNG.java:1169)<br>org.testng.TestNG.run(TestNG.java:1064)<br>org.testng.remote.AbstractRemoteTestNG.run(AbstractRemoteTestNG.java:132)<br>org.testng.remote.RemoteTestNG.initAndRun(RemoteTestNG.java:236)<br>org.testng.remote.RemoteTestNG.main(RemoteTestNG.java:81)<br>",
                    "duration": 0,
                    "type": "MessageError",
                    "status": "Success",
                    "children": []
                  }
                ]
              }
            ]
          },
          {
            "itemNumber": 7,
            "title": "report_wait_test",
            "url": "about:blank",
            "duration": 825,
            "type": "Test",
            "status": "Success",
            "children": [
              {
                "itemNumber": 1,
                "title": "Test Wait Success",
                "description": "",
                "url": "about:blank",
                "duration": 332,
                "type": "Wait",
                "status": "Success",
                "children": []
              },
              {
                "itemNumber": 2,
                "title": "Test Wait Fail",
                "description": "",
                "url": "about:blank",
                "duration": 444,
                "type": "Wait",
                "status": "Success",
                "children": []
              }
            ]
          }
        ]
      }
    ]
  },
  {
	    "itemNumber": 1,
	    "title": "Another Suite",
	    "url": "about:blank",
	    "duration": 73767,
	    "type": "Suite",
	    "status": "Success",
	    "children": [
	      {
	        "itemNumber": 3,
	        "title": "com.reporter.example.SomeClass",
	        "url": "about:blank",
	        "duration": 64759,
	        "type": "Class",
	        "status": "Fail",
	        "children": [
	          {
	            "itemNumber": 1,
	            "title": "SomeTest",
	            "url": "about:blank",
	            "duration": 20130,
	            "type": "Test",
	            "status": "Success",
	            "children": []
	          }
	        ]
	      }]
  }
]);
		