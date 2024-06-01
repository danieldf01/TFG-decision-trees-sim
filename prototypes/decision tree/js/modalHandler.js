import { transformData } from './csvHandler.js';

const svgId = 'svgDT';

function handleUserCsv() {
    const fileInput = document.getElementById('csvFile');
    const file = fileInput.files[0];

    if (file && file.type === 'text/csv') {
        Papa.parse(file, {
            skipEmptyLines: true,
            complete: function (results) {
                var contContainer = document.getElementById("contentContainer");
                if (contContainer.style.display == "none") {
                    contContainer.style.display = "block";
                }

                const data = results.data;

                // Transform, store the data and build the tables and tree upon it
                transformData(data);

                // Close the modal
                const uploadModal = document.getElementById('uploadModal');
                const modal = bootstrap.Modal.getInstance(uploadModal);
                modal.hide();

                // Change the select placeholder back to "Choose example dataset"
                var selectPlaceholder = document.getElementById('selectPlaceholder');
                selectPlaceholder.selected = true;
                
                var currentDatasetSpan = document.getElementById('currentDatasetSpan');
                currentDatasetSpan.textContent = file.name;

                var datasetCardBody = document.getElementById('datasetCardBody');
                datasetCardBody.style.display = "none";
            }
        });
    } else {
        alert('Please upload a valid CSV file.');
    }
}

export { handleUserCsv }