import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
const Products = () => {
  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "sku", headerName: "SKU", width: 70 },
    { field: "productName", headerName: "Product Name", width: 130 },
    { field: "productescription", headerName: "Product Description", width: 130 },
    { field: "productType", headerName: "Type", width: 130 },
    { field: "category", headerName: "Category", width: 130 },
    { field: "qty", headerName: "Quantity", width: 130 },
    {
      field: "price",
      headerName: "Price",
      type: "number",
      width: 90,
    },
    {
      field: "inventory",
      headerName: "Inventry",
      type: "number",
      width: 90,
    },
    {
      field: "availability",
      headerName: "Availability",
      type: "number",
      width: 90,
    },
    {
      field: "color",
      headerName: "Color", //Multiple Color Selection
      type: "number",
      width: 90,
    },
    {
      field: "size",
      headerName: "Size", //s,m,l,xl,xxl
      type: "number",
      width: 90,
    },
    {
      field: "dimensions",
      headerName: "Dimensions", //s,m,l,xl,xxl
      type: "number",
      width: 90,
    },
    {
      field: "actions",
      headerName: "Actions",
      type: "number",
      width: 90,
    },
  ];

  const rows = [
    { id: 1, lastName: "Snow", firstName: "Jon", age: 35 },
    { id: 2, lastName: "Lannister", firstName: "Cersei", age: 42 },
    { id: 3, lastName: "Lannister", firstName: "Jaime", age: 45 },
    { id: 4, lastName: "Stark", firstName: "Arya", age: 16 },
    { id: 5, lastName: "Targaryen", firstName: "Daenerys", age: null },
    { id: 6, lastName: "Melisandre", firstName: null, age: 150 },
    { id: 7, lastName: "Clifford", firstName: "Ferrara", age: 44 },
    { id: 8, lastName: "Frances", firstName: "Rossini", age: 36 },
    { id: 9, lastName: "Roxie", firstName: "Harvey", age: 65 },
  ];

  return (
    <div className="productContainer">
      <div className="main-title">
        <h3>PRODUCTS</h3>
      </div>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 100 },
            },
          }}
          pageSizeOptions={[5, 10]}
        />
    </div>
  );
};

export default Products;
