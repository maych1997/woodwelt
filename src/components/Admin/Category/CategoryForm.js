import React, { useEffect, useRef, useState } from "react";
import "./category.css";
import { MenuItem, Select, TextField } from "@mui/material";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
  ClassicEditor,
  AccessibilityHelp,
  Autoformat,
  Autosave,
  BlockQuote,
  Bold,
  Essentials,
  Heading,
  Indent,
  IndentBlock,
  Italic,
  Link,
  List,
  ListProperties,
  MediaEmbed,
  Paragraph,
  PasteFromOffice,
  SelectAll,
  Table,
  TableCaption,
  TableCellProperties,
  TableColumnResize,
  TableProperties,
  TableToolbar,
  TextTransformation,
  TodoList,
  Underline,
  Undo,
} from "ckeditor5";
import useFetchCategory from "../../../backend/firebase/System/Product/Category/FetchCategory";
import { useSelector } from "react-redux";
import { get, ref, set } from "firebase/database";
import { database } from "../../../backend/firebase/connection";
import { category } from "../../../backend/firebase/System/Product/Category/Category";
const CategoryForm = () => {
  const editorRef = useRef(null);
  const [isLayoutReady, setIsLayoutReady] = useState(false);
  const editorConfig = {
    toolbar: {
      items: [
        "undo",
        "redo",
        "|",
        "heading",
        "|",
        "bold",
        "italic",
        "underline",
        "|",
        "link",
        "mediaEmbed",
        "insertTable",
        "blockQuote",
        "|",
        "bulletedList",
        "numberedList",
        "todoList",
        "outdent",
        "indent",
      ],
      shouldNotGroupWhenFull: false,
    },
    plugins: [
      AccessibilityHelp,
      Autoformat,
      Autosave,
      BlockQuote,
      Bold,
      Essentials,
      Heading,
      Indent,
      IndentBlock,
      Italic,
      Link,
      List,
      ListProperties,
      MediaEmbed,
      Paragraph,
      PasteFromOffice,
      SelectAll,
      Table,
      TableCaption,
      TableCellProperties,
      TableColumnResize,
      TableProperties,
      TableToolbar,
      TextTransformation,
      TodoList,
      Underline,
      Undo,
    ],
    heading: {
      options: [
        {
          model: "paragraph",
          title: "Paragraph",
          class: "ck-heading_paragraph",
        },
        {
          model: "heading1",
          view: "h1",
          title: "Heading 1",
          class: "ck-heading_heading1",
        },
        {
          model: "heading2",
          view: "h2",
          title: "Heading 2",
          class: "ck-heading_heading2",
        },
        {
          model: "heading3",
          view: "h3",
          title: "Heading 3",
          class: "ck-heading_heading3",
        },
        {
          model: "heading4",
          view: "h4",
          title: "Heading 4",
          class: "ck-heading_heading4",
        },
        {
          model: "heading5",
          view: "h5",
          title: "Heading 5",
          class: "ck-heading_heading5",
        },
        {
          model: "heading6",
          view: "h6",
          title: "Heading 6",
          class: "ck-heading_heading6",
        },
      ],
    },
    initialData: "",
    link: {
      addTargetToExternalLinks: true,
      defaultProtocol: "https://",
      decorators: {
        toggleDownloadable: {
          mode: "manual",
          label: "Downloadable",
          attributes: {
            download: "file",
          },
        },
      },
    },
    list: {
      properties: {
        styles: true,
        startIndex: true,
        reversed: true,
      },
    },
    placeholder: "Type or paste your content here!",
    table: {
      contentToolbar: [
        "tableColumn",
        "tableRow",
        "mergeTableCells",
        "tableProperties",
        "tableCellProperties",
      ],
    },
  };
  const [categoryName, setCategoryName] = useState();
  const [slug, setSlug] = useState();
  const [parentCategory, setParentCategory] = useState(-1);
  const [description, setDescription] = useState();
  const [categoryVisibility, setCategoyVisibility] = useState(0);
  const displayCategory = useSelector((state) => state.store);
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    setIsLayoutReady(true);
    const fetchCategories = async () => {
      try {
        const productRef = ref(database, "category/");
        const snapshot = await get(productRef);

        if (snapshot.exists()) {
          const data = snapshot.val();
          const categoryArray = Object.keys(data).map((key, index) => ({
            id: index,
            ...data[key],
          }));
          setCategories(categoryArray);
        } else {
          console.log("No data available");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchCategories();
    return () => setIsLayoutReady(false);
  }, []);
  useFetchCategory();
  const validateCategory = () => {
    // Check if SKU is provided and valid
    if (!categoryName || !categoryName.trim()) {
      return "Category Name is required.";
    }
    if (!slug || !slug.trim()) {
      return "Slug is required.";
    }
    return null; // No validation errors
  };
  const publishCategory = async () => {
    // alert(color.name)
    const validationError = validateCategory();
    if (validationError) {
      alert(validationError);
    } else {
      try {
        const categoryRef = ref(
          database,
          "category/" + slug.toLowerCase().replace(/\s+/g, "_")
        );
        // Check if the user data already exists
        const snapshot = await get(categoryRef);
        if (snapshot.exists()) {
          alert(
            `Category with slug ${slug
              .toLowerCase()
              .replace(/\s+/g, "_")} already exists.`
          );
          return; // Exit the function if the product exists
        } else {
          await set(categoryRef, {
            slug: slug.toLowerCase().replace(/\s+/g, "_"),
            categoryName: categoryName,
            categoryVisibility: categoryVisibility,
            parentCategory:parentCategory,
          });
          alert(
            "Category " +
              categoryName +
              " with slug " +
              slug.toLowerCase().replace(/\s+/g, "_") +
              " added successfully"
          );
        }
      } catch (error) {
        alert(error);
      }
    }
  };
  return (
    <div className="categoryContainer">
      <div className="main-title">
        <h3>Add Category</h3>
      </div>
      <div className="sub-container">
        <div className="form-container">
          <TextField
            className="text-input"
            id="category_name"
            size="small"
            label="Name"
            variant="outlined"
            type="text"
            onChange={(event) => {
              setCategoryName(event.target.value);
            }}
          />
          <TextField
            className="text-input"
            id="slug"
            size="small"
            label="Slug"
            variant="outlined"
            type="text"
            onChange={(event) => {
              setSlug(event.target.value);
            }}
          />
           <div className="headingContainer">
            <h5>Parent Category</h5>
          </div>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={parentCategory}
            onChange={(event) => {
              setParentCategory(event.target.value);
            }}
            size="small"
          >
            <MenuItem value={-1}>None</MenuItem>
            {/* Custom value for "none" */}
            {categories?.map((item, index) => (
              <MenuItem key={index} value={index}>
                {item.categoryName}
              </MenuItem>
            ))}
          </Select>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={categoryVisibility}
            onChange={(event) => {
              setCategoyVisibility(event.target.value);
            }}
            size="small"
          >
            {displayCategory?.categoryVisibility?.map((item, index) => {
              return (
                <MenuItem key={index} value={index}>
                  {item}
                </MenuItem>
              );
            })}
          </Select>
          <div className="buttonContainer">
            <button
              className="add-product-button"
              onClick={() => {
                publishCategory();
              }}
            >
              Publish
            </button>
            <button className="add-product-button" onClick={() => {}}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryForm;
