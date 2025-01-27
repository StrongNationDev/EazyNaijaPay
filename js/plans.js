const plans = {
  MTN: [
    { plan_id: 354, type: "SME", amount: "₦1295.0", size: "5.0 GB", validity: "1 month" },
    { plan_id: 230, type: "SME", amount: "₦780.0", size: "3.0 GB", validity: "1 month" },
    { plan_id: 50, type: "SME", amount: "₦520.0", size: "2.0 GB", validity: "1 month" },
    { plan_id: 51, type: "SME", amount: "₦260.0", size: "1.0 GB", validity: "1 month" },
    { plan_id: 60, type: "SME", amount: "₦130.0", size: "500.0 MB", validity: "1 month" },
    { plan_id: 61, type: "GIFTING", amount: "₦1152.0", size: "1.5 GB", validity: "1 month" },
    { plan_id: 65, type: "GIFTING", amount: "₦1920.0", size: "4.0 GB", validity: "1 month" },
    { plan_id: 66, type: "GIFTING", amount: "₦3840.0", size: "12.0 GB", validity: "1 month" },
    { plan_id: 67, type: "GIFTING", amount: "₦5280.0", size: "20.0 GB", validity: "1 month" },
    { plan_id: 77, type: "GIFTING", amount: "₦10560.0", size: "40.0 GB", validity: "1 month" },
    { plan_id: 104, type: "GIFTING", amount: "₦15360.0", size: "75.0 GB", validity: "1 month" },
    { plan_id: 109, type: "GIFTING", amount: "₦576.0", size: "1.0 GB", validity: "1 month" },
    { plan_id: 336, type: "GIFTING", amount: "₦289.0", size: "750.0 MB", validity: "1 month" },
    { plan_id: 345, type: "GIFTING", amount: "₦28800.0", size: "200.0 GB", validity: "1 month" },
    { plan_id: 350, type: "GIFTING", amount: "₦72000.0", size: "600.0 GB", validity: "1 month" },
    // Add more MTN plans her
  ],
  GLO: [
    { plan_id: 27, type: "GIFTING", amount: "₦3240.0", size: "18.0 GB", validity: "1 month" },
    { plan_id: 28, type: "GIFTING", amount: "₦2430.0", size: "14.0 GB", validity: "1 month" },
    { plan_id: 29, type: "GIFTING", amount: "₦2025.0", size: "10.8 GB", validity: "1 month" },
    { plan_id: 73, type: "GIFTING", amount: "₦4050.0", size: "24.0 GB", validity: "1 month" },
    { plan_id: 144, type: "GIFTING", amount: "₦16200.0", size: "138.0 GB", validity: "1 month" },
    { plan_id: 207, type: "GIFTING", amount: "₦8100.0", size: "50.0 GB", validity: "1 month" },
    { plan_id: 321, type: "AWOOF GIFTING", amount: "₦195.0", size: "1.0 GB", validity: "1 month" },
    { plan_id: 323, type: "AWOOF GIFTING", amount: "₦477.0", size: "3.5 GB", validity: "1 month" },
    // Add more GLO plans here
  ],
  "9MOBILE": [
    { plan_id: 13, type: "GIFTING", amount: "₦4050.0", size: "15.0 GB", validity: "1 month" },
    { plan_id: 14, type: "GIFTING", amount: "₦3240.0", size: "11.0 GB", validity: "1 month" },
    { plan_id: 58, type: "GIFTING", amount: "₦12150.0", size: "75.0 GB", validity: "1 month" },
    { plan_id: 119, type: "GIFTING", amount: "₦168.0", size: "650.0 MB", validity: "1 month" },
    { plan_id: 256, type: "SME", amount: "₦9100.0", size: "40.0 GB", validity: "1 month" },
    { plan_id: 241, type: "SME", amount: "₦300.0", size: "1.0 GB", validity: "1 month" },
    { plan_id: 283, type: "CORPORATE GIFTING", amount: "₦4050.0", size: "30.0 GB", validity: "1 month" },
    { plan_id: 281, type: "CORPORATE GIFTING", amount: "₦2025.0", size: "15.0 GB", validity: "1 month" },
    // Add more 9MOBILE plans here
  ],
  AIRTEL: [
    { plan_id: 125, type: "GIFTING", amount: "₦440.0", size: "1.0 GB", validity: "1 month" },
    { plan_id: 126, type: "GIFTING", amount: "₦440.0", size: "2.0 GB", validity: "1 month" },
    { plan_id: 139, type: "GIFTING", amount: "₦8800.0", size: "40.0 GB", validity: "1 month" },
    { plan_id: 313, type: "AWOOF GIFTING", amount: "₦70.0", size: "100.0 MB", validity: "1 month" },
    { plan_id: 318, type: "AWOOF GIFTING", amount: "₦3020.0", size: "15.0 GB", validity: "1 month" },
    { plan_id: 231, type: "CORPORATE GIFTING", amount: "₦2750.0", size: "10.0 GB", validity: "1 month" },
    { plan_id: 212, type: "CORPORATE GIFTING", amount: "₦137.5", size: "500.0 MB", validity: "1 month" },
    // Add more AIRTEL plans here
  ],
};

export default plans;