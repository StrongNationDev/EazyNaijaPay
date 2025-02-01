import { plans } from '../update/plans.js';

document.addEventListener("DOMContentLoaded", function () {
    const networkSelect = document.getElementById("network-select");
    const planSelect = document.getElementById("preferable-plan");
    const amountInput = document.getElementById("amount-to-pay");

    const networkMap = {
        "1": "MTN",
        "2": "GLO",
        "3": "9MOBILE",
        "4": "AIRTEL"
    };

    function updatePlans() {
        const selectedNetworkId = networkSelect.value;
        const selectedNetwork = networkMap[selectedNetworkId]; 
        
        planSelect.innerHTML = '<option value="" disabled selected>Choose your desired plan</option>';
        amountInput.value = "";

        console.log("Selected Network ID:", selectedNetworkId);
        console.log("Mapped Network Name:", selectedNetwork);

        if (plans[selectedNetwork]) {
            plans[selectedNetwork].forEach(plan => {
                const option = document.createElement("option");
                option.value = plan.plan_id;
                option.textContent = `${plan.type} - ${plan.size} - ${plan.amount} (${plan.validity})`;
                option.dataset.amount = plan.amount;
                planSelect.appendChild(option);
            });

            console.log("Plans loaded:", plans[selectedNetwork]);
        } else {
            console.log("No plans found for:", selectedNetwork);
        }
    }

    planSelect.addEventListener("change", function () {
        const selectedOption = planSelect.options[planSelect.selectedIndex];
        amountInput.value = selectedOption.dataset.amount || "";
    });

    networkSelect.addEventListener("change", updatePlans);
});



// Chaninging of icons along with the selected network
document.addEventListener("DOMContentLoaded", function () {
    const networkSelect = document.getElementById("network-select");
    const selectedIcon = document.getElementById("selected-icon");

    function updateNetworkIcon() {
        const selectedOption = networkSelect.options[networkSelect.selectedIndex];
        const iconPath = selectedOption.getAttribute("data-icon");
        
        if (iconPath) {
            selectedIcon.src = iconPath;
        }
    }

    networkSelect.addEventListener("change", updateNetworkIcon);
});
