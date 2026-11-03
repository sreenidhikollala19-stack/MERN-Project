const BASE_URL = 'http://127.0.0.1:5000/api';

async function runTests() {
  console.log('--- Starting EventEase Full-Stack Integration Tests ---');
  let passCount = 0;
  let failCount = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`[PASS] ${message}`);
      passCount++;
    } else {
      console.error(`[FAIL] ${message}`);
      failCount++;
    }
  }

  async function api(endpoint, options = {}) {
    const { headers = {}, ...rest } = options;
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      ...rest,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    });
    const data = await res.json();
    return { status: res.status, ok: res.ok, data };
  }

  try {
    // 1. Health Check
    const health = await api('/health');
    assert(health.data.status === 'ok', 'API Health Check');

    // 2. Fetch Categories
    const categories = await api('/categories');
    assert(categories.data.success && categories.data.count >= 10, `Categories API returned ${categories.data.count} categories (>= 10 required)`);

    // 3. Location Search (City = Mumbai)
    const mumbaiVendors = await api('/vendors?city=Mumbai');
    assert(mumbaiVendors.data.success && mumbaiVendors.data.count > 0, `Location Search (Mumbai) returned ${mumbaiVendors.data.count} vendors`);

    // 4. Budget Filter
    const budgetVendors = await api('/vendors?minPrice=20000&maxPrice=100000');
    assert(budgetVendors.data.success, `Budget range filter returned ${budgetVendors.data.count} vendors`);

    // 5. Customer Login
    const customerLogin = await api('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'customer@eventease.com',
        password: 'password123',
      }),
    });
    assert(customerLogin.data.success && customerLogin.data.token, 'Customer Login');
    const customerToken = customerLogin.data.token;
    const customerHeaders = { Authorization: `Bearer ${customerToken}` };

    // 6. Vendor Login
    const vendorLogin = await api('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'karan.lens@eventease.com',
        password: 'password123',
      }),
    });
    assert(vendorLogin.data.success && vendorLogin.data.token, 'Vendor Login');
    const vendorToken = vendorLogin.data.token;
    const vendorHeaders = { Authorization: `Bearer ${vendorToken}` };

    // 7. Admin Login
    const adminLogin = await api('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'admin@eventease.com',
        password: 'password123',
      }),
    });
    assert(adminLogin.data.success && adminLogin.data.user.role === 'admin', 'Admin Login');
    const adminToken = adminLogin.data.token;
    const adminHeaders = { Authorization: `Bearer ${adminToken}` };

    // 8. Admin Stats
    const adminStats = await api('/admin/stats', { headers: adminHeaders });
    assert(adminStats.data.success && adminStats.data.data.totalVendors >= 15, `Admin Stats (Vendors count >= 15: ${adminStats.data.data.totalVendors})`);

    // 9. Customer submits new enquiry
    const vendorId = vendorLogin.data.vendorProfile.id;
    console.log('Submitting enquiry for vendorId:', vendorId);
    const newEnquiry = await api('/enquiries', {
      method: 'POST',
      headers: customerHeaders,
      body: JSON.stringify({
        vendorId,
        name: 'Aditi Sharma',
        email: 'customer@eventease.com',
        phone: '+91 98765 43210',
        eventType: 'Wedding',
        eventDate: '2026-12-15',
        eventLocation: 'Bandra, Mumbai',
        serviceType: 'Royal Heritage Gold Package',
        expectedBudget: 95000,
        message: 'Integration test enquiry message',
      }),
    });
    console.log('newEnquiry response:', newEnquiry);
    assert(newEnquiry.data.success && newEnquiry.data.data._id, 'Customer Enquiry Submission');
    const enquiryId = newEnquiry.data.data._id;

    // 10. Vendor retrieves enquiries & updates status
    const vendorEnquiries = await api('/enquiries/vendor', { headers: vendorHeaders });
    assert(vendorEnquiries.data.success && vendorEnquiries.data.count > 0, 'Vendor Dashboard Enquiries Retrieval');

    const updateStatus = await api(`/enquiries/${enquiryId}/status`, {
      method: 'PUT',
      headers: vendorHeaders,
      body: JSON.stringify({
        status: 'Accepted',
        vendorNotes: 'Verified and confirmed available for 2026-12-15!',
      }),
    });
    assert(updateStatus.data.success && updateStatus.data.data.status === 'Accepted', 'Vendor Enquiry Status Update (Pending -> Accepted)');

    // 11. Customer tracks updated enquiry
    const customerEnquiries = await api('/enquiries/customer', { headers: customerHeaders });
    const matchingEnquiry = customerEnquiries.data.data.find(e => e._id === enquiryId);
    assert(matchingEnquiry && matchingEnquiry.status === 'Accepted', 'Customer Real-Time Enquiry Tracking');

    // 12. Toggle Favourite
    const favRes = await api(`/favourites/toggle/${vendorId}`, {
      method: 'POST',
      headers: customerHeaders,
    });
    assert(favRes.data.success, 'Customer Favourite Toggle');

    // 13. Submit Review
    const reviewRes = await api(`/reviews/vendor/${vendorId}`, {
      method: 'POST',
      headers: customerHeaders,
      body: JSON.stringify({
        rating: 5,
        comment: 'Brilliant photography team, loved the teaser reel!',
        eventType: 'Wedding',
      }),
    });
    assert(reviewRes.data.success, 'Customer Review Submission');

    console.log(`\n--- Test Summary: ${passCount} Passed, ${failCount} Failed ---`);
    if (failCount === 0) {
      console.log('ALL INTEGRATION TESTS PASSED PERFECTLY!');
      process.exit(0);
    } else {
      process.exit(1);
    }
  } catch (error) {
    console.error('Test error:', error);
    process.exit(1);
  }
}

runTests();
