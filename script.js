document.addEventListener("DOMContentLoaded", function () {
    const transactionForm = document.getElementById('transaction-form');
    const historyTable = document.getElementById('history-table').getElementsByTagName('tbody')[0];
    const summaryChartCtx = document.getElementById('summary-chart').getContext('2d');
    const exportButton = document.getElementById('export-data');

    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

    function saveTransactions() {
        localStorage.setItem('transactions', JSON.stringify(transactions));
    }

    function renderHistory() {
        historyTable.innerHTML = '';
        transactions.forEach(transaction => {
            const row = historyTable.insertRow();
            row.insertCell(0).textContent = transaction.date;
            row.insertCell(1).textContent = transaction.category;
            row.insertCell(2).textContent = transaction.amount;
        });
    }

    function renderSummary() {
        const categories = {};
        transactions.forEach(transaction => {
            if (!categories[transaction.category]) {
                categories[transaction.category] = 0;
            }
            categories[transaction.category] += parseFloat(transaction.amount);
        });

        const labels = Object.keys(categories);
        const data = Object.values(categories);

        new Chart(summaryChartCtx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                }
            },
        });
    }

    function addTransaction(event) {
        event.preventDefault();

        const amount = document.getElementById('amount').value;
        const category = document.getElementById('category').value;
        const date = document.getElementById('date').value;

        const transaction = { amount, category, date };
        transactions.push(transaction);
        saveTransactions();
        renderHistory();
        renderSummary();
        transactionForm.reset();
    }

    function exportData() {
        const data = JSON.stringify(transactions, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'transactions.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    transactionForm.addEventListener('submit', addTransaction);
    exportButton.addEventListener('click', exportData);

    renderHistory();
    renderSummary();
});