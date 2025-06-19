// DocuMed AI Automated Test Script
// Run this in browser console (F12) on your frontend page

console.log('🧪 Starting DocuMed AI Tests...\n');

// Test 1: Backend Health Check
async function testBackendHealth() {
  try {
    const response = await fetch('https://documed-ai-backend.onrender.com/health');
    const data = await response.json();
    
    if (data.status === 'OK') {
      console.log('✅ Backend Health: PASSED');
      return true;
    } else {
      console.log('❌ Backend Health: FAILED');
      return false;
    }
  } catch (error) {
    console.log('❌ Backend Health: ERROR -', error.message);
    return false;
  }
}

// Test 2: API Status Check
async function testAPIStatus() {
  try {
    const response = await fetch('https://documed-ai-backend.onrender.com/api/status');
    const data = await response.json();
    
    if (data.service === 'DocuMed AI API' && data.status === 'active') {
      console.log('✅ API Status: PASSED');
      return true;
    } else {
      console.log('❌ API Status: FAILED');
      return false;
    }
  } catch (error) {
    console.log('❌ API Status: ERROR -', error.message);
    return false;
  }
}

// Test 3: Frontend Elements Check
function testFrontendElements() {
  const tests = [
    { name: 'Title', selector: '.app-title', expected: 'DocuMed AI' },
    { name: 'Status Card', selector: '.status-card', expected: null },
    { name: 'Feature Cards', selector: '.feature-card', expected: 3 },
    { name: 'CTA Button', selector: '.cta-button', expected: null }
  ];
  
  let passed = 0;
  
  tests.forEach(test => {
    const elements = document.querySelectorAll(test.selector);
    
    if (test.expected === null && elements.length > 0) {
      console.log(`✅ ${test.name}: FOUND`);
      passed++;
    } else if (typeof test.expected === 'number' && elements.length === test.expected) {
      console.log(`✅ ${test.name}: FOUND (${elements.length})`);
      passed++;
    } else if (typeof test.expected === 'string' && elements[0]?.textContent.includes(test.expected)) {
      console.log(`✅ ${test.name}: FOUND`);
      passed++;
    } else {
      console.log(`❌ ${test.name}: NOT FOUND`);
    }
  });
  
  return passed === tests.length;
}

// Test 4: Performance Check
function testPerformance() {
  const navigation = performance.getEntriesByType('navigation')[0];
  const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
  
  if (loadTime < 3000) {
    console.log(`✅ Performance: PASSED (${Math.round(loadTime)}ms)`);
    return true;
  } else {
    console.log(`❌ Performance: SLOW (${Math.round(loadTime)}ms)`);
    return false;
  }
}

// Run All Tests
async function runAllTests() {
  console.log('🚀 Running all tests...\n');
  
  const results = {
    backendHealth: await testBackendHealth(),
    apiStatus: await testAPIStatus(),
    frontendElements: testFrontendElements(),
    performance: testPerformance()
  };
  
  const totalTests = Object.keys(results).length;
  const passedTests = Object.values(results).filter(Boolean).length;
  
  console.log(`\n📊 Test Results: ${passedTests}/${totalTests} passed`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All tests passed! Your app is working perfectly!');
  } else {
    console.log('⚠️ Some tests failed. Check the logs above for details.');
  }
  
  return results;
}

// Auto-run tests
runAllTests();
