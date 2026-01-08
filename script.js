function createInputs() {
    const count = document.getElementById("peopleCount").value;
    const container = document.getElementById("peopleInputs");
    container.innerHTML = "";

    for (let i = 0; i < count; i++) {
        const row = document.createElement("div");
        row.className = "person-row";
        row.innerHTML = `
            <input type="text" placeholder="Name">
            <input type="number" placeholder="Amount">
        `;
        container.appendChild(row);
    }
}

function calculate() {
    const rows = document.querySelectorAll(".person-row");
    let people = [];

    rows.forEach(row => {
        const name = row.children[0].value.trim();
        const amount = Number(row.children[1].value);

        if (name && amount >= 0) {
            people.push({ name, amount });
        }
    });

    if (people.length === 0) return;

    const total = people.reduce((sum, p) => sum + p.amount, 0);
    const share = total / people.length;

    let debtors = [];
    let creditors = [];

    people.forEach(p => {
        const diff = p.amount - share;
        if (diff < 0) debtors.push({ name: p.name, amount: -diff });
        else if (diff > 0) creditors.push({ name: p.name, amount: diff });
    });

    let i = 0, j = 0;
    let transactionsHTML = "";

    while (i < debtors.length && j < creditors.length) {
        let pay = Math.min(debtors[i].amount, creditors[j].amount);

        transactionsHTML += `
            <div class="transaction">
                <span>${debtors[i].name} → ${creditors[j].name}</span>
                <span class="amount">₹${pay.toFixed(2)}</span>
            </div>
        `;

        debtors[i].amount -= pay;
        creditors[j].amount -= pay;

        if (debtors[i].amount === 0) i++;
        if (creditors[j].amount === 0) j++;
    }

    document.getElementById("result").innerHTML = `
        <div class="summary">
            <div class="total">Total Amount: ₹${total}</div>
            <div class="share">Each Person Pays: ₹${share.toFixed(2)}</div>
        </div>
        <div class="transactions">
            ${transactionsHTML || "<div class='transaction'>No transactions needed</div>"}
        </div>
    `;
}
