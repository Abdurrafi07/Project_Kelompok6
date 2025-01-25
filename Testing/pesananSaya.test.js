/**
 * @jest-environment jsdom
 */

const $ = require('jquery');
require('jest-fetch-mock').enableMocks();

describe('Detail Booking Page', () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <div class="ticket">
                <div class="ticket-header">Booking ID: 1</div>
                <div class="ticket-body">
                    <div><strong>Nama Lengkap:</strong> John Doe</div>
                    <div><strong>Email Pribadi:</strong> john@example.com</div>
                    <div><strong>No Telepon:</strong> 123456789</div>
                    <div><strong>Jenis Kamar:</strong> Deluxe</div>
                    <div><strong>Check-in:</strong> 2024-01-01</div>
                    <div><strong>Check-out:</strong> 2024-01-05</div>
                    <div><strong>Harga:</strong> Rp 1.500.000</div>
                </div>
                <div class="ticket-footer">
                    <button class="btn btn-danger deleteBtn" data-id="1">Delete</button>
                    <button class="btn btn-primary pdfBtn" data-id="1">Download PDF</button>
                </div>
            </div>
        `;

        fetch.resetMocks();

        // Simulate the delete button functionality
        $('.deleteBtn').on('click', function () {
            const id = $(this).data('id');
            fetch(`/dataCustomer/${id}`, { method: 'DELETE' })
                .then((response) => response.json())
                .then((data) => console.log('Deleted:', data))
                .catch((error) => console.error('Error:', error));
        });

        // Simulate the PDF button functionality
        $('.pdfBtn').on('click', function () {
            const id = $(this).data('id');
            console.log(`Downloading PDF for booking ${id}`);
        });
    });

    it('should handle delete button click', () => {
        const deleteButton = document.querySelector('.deleteBtn');

        // Mock the fetch response for delete
        fetch.mockResponseOnce(JSON.stringify({ success: true }));

        // Simulate the click on delete button
        deleteButton.click();

        // Verify the fetch call for delete
        expect(fetch).toHaveBeenCalledWith('/dataCustomer/1', { method: 'DELETE' });
        expect(fetch).toHaveBeenCalledTimes(1); // Ensure it was called exactly once
    });

    it('should handle PDF button click', () => {
        const pdfButton = document.querySelector('.pdfBtn');
        
        // Spy on console.log to check if the PDF download message is logged
        const consoleSpy = jest.spyOn(console, 'log');

        // Simulate the click on PDF button
        pdfButton.click();

        // Verify that the correct log message was called for PDF download
        expect(consoleSpy).toHaveBeenCalledWith('Downloading PDF for booking 1');
        expect(consoleSpy).toHaveBeenCalledTimes(1); // Ensure it was called exactly once
    });
});
