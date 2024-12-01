// Global variables for grid
let gridApi = null;
let gridColumnApi = null;
let gridOptions = null;

// Column definitions
const columnDefs = [
  {
    headerName: "Actions",
    field: "actions",
    width: 120,
    cellRenderer: (params) => {
      return `
                <button onclick="editRow(${params.data.id})">Edit</button>
                <button onclick="deleteRow(${params.data.id})">Delete</button>
            `;
    },
  },
  { field: "id", headerName: "ID", sortable: true, width: 70 },
  { field: "field1", headerName: "لوحده الاداريه", editable: true },
  { field: "field2", headerName: "لوحده الاداريه", editable: true },
  { field: "field3", headerName: "الاسم", editable: true },
  { field: "field4", headerName: "الرقم الوظيفي", editable: true },
  { field: "field5", headerName: "الاسم", editable: true },
  { field: "field6", headerName: "City", editable: true },
  { field: "field7", headerName: "State/Province", editable: true },
  { field: "field8", headerName: "Country", editable: true },
  { field: "field9", headerName: "Age", editable: true },
  { field: "field10", headerName: "Birth Date", editable: true },
  { field: "field11", headerName: "Occupation", editable: true },
];

// Grid options configuration
const defaultColDef = {
  resizable: true,
  sortable: true,
  filter: true,
  minWidth: 100,
};

// Initialize the grid when the document is ready
document.addEventListener("DOMContentLoaded", () => {
  initializeGrid();
  setupEventListeners();
});

function initializeGrid() {
  const gridDiv = document.querySelector("#myGrid");
  gridDiv.style.height = "500px";
  gridDiv.style.width = "100%";

  gridOptions = {
    columnDefs: columnDefs,
    defaultColDef: defaultColDef,
    rowData: [],
    rowSelection: "single",
    onGridReady: onGridReady,
    onCellEditingStopped: updateRow,
  };

  // Create new grid instance
  new agGrid.Grid(gridDiv, gridOptions);
}

function onGridReady(params) {
  console.log("Grid is ready");
  gridApi = params.api;
  gridColumnApi = params.columnApi;
  loadData();
}

function setupEventListeners() {
  // Search functionality
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", onSearchChange);
  }

  // Export functionality
  const exportButton = document.getElementById("exportButton");
  if (exportButton) {
    exportButton.addEventListener("click", onExportClick);
  }
}

async function loadData() {
  try {
    console.log("Fetching data from server...");
    const response = await fetch("http://localhost:8080/get-entries");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log("Data received:", data);

    if (!gridApi) {
      console.error("Grid API not available");
      return;
    }

    // Set the row data
    console.log("Setting row data to grid");
    gridApi.setRowData(data);
    gridApi.sizeColumnsToFit();
    console.log("Grid data updated successfully");
  } catch (error) {
    console.error("Error loading data:", error);
    alert("Failed to load data from server: " + error.message);
  }
}

function onSearchChange(e) {
  if (gridApi) {
    gridApi.setQuickFilter(e.target.value);
  }
}

function onExportClick() {
  if (gridApi) {
    gridApi.exportDataAsCsv({
      fileName: "data_export.csv",
    });
  }
}

async function updateRow(params) {
  if (!params.data) return;

  try {
    const response = await fetch(
      `http://localhost:8080/update-entry/${params.data.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params.data),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log("Row updated successfully:", result);
  } catch (error) {
    console.error("Error updating row:", error);
    alert("Failed to update entry: " + error.message);
  }
}

async function editRow(id) {
  if (!gridApi) return;

  const rowNode = gridApi.getRowNode(id.toString());
  if (rowNode) {
    gridApi.setFocusedCell(rowNode.rowIndex, "field1");
    gridApi.startEditingCell({
      rowIndex: rowNode.rowIndex,
      colKey: "field1",
    });
  }
}

async function deleteRow(id) {
  try {
    const response = await fetch(`http://localhost:8080/delete-entry/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log("Delete response:", result);

    if (gridApi) {
      const rowNode = gridApi.getRowNode(id.toString());
      if (rowNode) {
        const rowData = [];
        gridApi.forEachNode((node) => rowData.push(node.data));
        const updatedData = rowData.filter((row) => row.id !== id);
        gridApi.setRowData(updatedData);
      }
    }

    console.log("Row deleted successfully");
  } catch (error) {
    console.error("Error deleting row:", error);
    alert("Failed to delete entry: " + error.message);
  }
}
