document.getElementById('dataForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = {
        field1: e.target.field1.value,
        field2: e.target.field2.value,
        field3: e.target.field3.value,
        field4: e.target.field4.value,
        field5: e.target.field5.value,
        field6: e.target.field6.value,
        field7: e.target.field7.value,
        field8: e.target.field8.value,
        field9: e.target.field9.value,
        field10: e.target.field10.value,
        field11: e.target.field11.value
    };

    try {
        const response = await fetch('http://localhost:8080/add-entry', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('Entry added:', result);
        alert('Entry added successfully!');
        e.target.reset(); // Clear form after submission
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to add entry: ' + error.message);
    }
});
