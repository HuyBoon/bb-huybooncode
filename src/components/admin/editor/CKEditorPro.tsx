import { useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
    ClassicEditor,
    Autoformat,
    Bold,
    Italic,
    Underline,
    BlockQuote,
    Base64UploadAdapter,
    CloudServices,
    Essentials,
    Heading,
    Image,
    ImageCaption,
    ImageResize,
    ImageStyle,
    ImageToolbar,
    ImageUpload,
    PictureEditing,
    Indent,
    IndentBlock,
    Link,
    List,
    Font,
    Mention,
    Paragraph,
    PasteFromOffice,
    Table,
    TableColumnResize,
    TableToolbar,
    TextTransformation,
    SourceEditing,
    Alignment,
} from "ckeditor5";
import "ckeditor5/ckeditor5.css";

interface CKEditorProProps {
    content: string;
    onChange: (html: string) => void;
    onUploadImage: (file: File) => Promise<string>;
    placeholder?: string;
}

class CustomUploadAdapter {
    loader: any;
    onUploadImage: (file: File) => Promise<string>;
    constructor(loader: any, onUploadImage: (file: File) => Promise<string>) {
        this.loader = loader;
        this.onUploadImage = onUploadImage;
    }

    upload() {
        return this.loader.file.then((file: File) => {
            return this.onUploadImage(file).then((url) => {
                return { default: url };
            });
        });
    }

    abort() {}
}

function UploadAdapterPlugin(editor: any) {
    editor.plugins.get("FileRepository").createUploadAdapter = (
        loader: any
    ) => {
        const onUploadImage = editor.config.get("onUploadImage");
        if (!onUploadImage) {
            console.error("onUploadImage callback is missing!");
            return null;
        }
        return new CustomUploadAdapter(loader, onUploadImage);
    };
}

const CKEditorPro = ({
    content = "",
    onChange,
    onUploadImage,
    placeholder = "Bắt đầu viết bài tuyệt vời của bạn...",
}: CKEditorProProps) => {
    const [editorInstance, setEditorInstance] = useState<any>(null);

    const editorConfig: any = {
        licenseKey: "GPL",
        plugins: [
            Essentials,
            Autoformat,
            BlockQuote,
            Bold,
            Italic,
            Underline,
            Heading,
            Font,
            Paragraph,
            Link,
            List,
            Indent,
            IndentBlock,
            Image,
            ImageCaption,
            ImageResize,
            ImageStyle,
            ImageToolbar,
            ImageUpload,
            PictureEditing,
            PasteFromOffice,
            Table,
            TableColumnResize,
            TableToolbar,
            TextTransformation,
            SourceEditing,
            Alignment,
        ],

        toolbar: {
            items: [
                "heading",
                "|",
                "bold",
                "italic",
                "underline",
                "|",
                "fontColor",
                "fontBackgroundColor",
                "|",
                "alignment",
                "|",
                "bulletedList",
                "numberedList",
                "|",
                "link",
                "blockQuote",
                "insertTable",
                "uploadImage",
                "|",
                "sourceEditing",
                "undo",
                "redo",
            ],
            shouldNotGroupWhenFull: true,
        },

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
            ],
        },

        image: {
            toolbar: [
                "imageTextAlternative",
                "toggleImageCaption",
                "|",
                "imageStyle:inline",
                "imageStyle:wrapText",
                "imageStyle:breakText",
                "|",
                "resizeImage",
            ],
            resizeOptions: [
                {
                    name: "resizeImage:original",
                    value: null,
                    label: "Original",
                },
                { name: "resizeImage:50", value: "50", label: "50%" },
                { name: "resizeImage:75", value: "75", label: "75%" },
            ],
        },

        table: {
            contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"],
        },
        placeholder,
        extraPlugins: [UploadAdapterPlugin],
        onUploadImage,
    };

    return (
        <div className="">
            <CKEditor
                editor={ClassicEditor}
                config={editorConfig}
                data={content}
                onReady={(editor: any) => {
                    setEditorInstance(editor);
                    editor.editing.view.focus();
                }}
                onChange={(_event: any, editor: any) => {
                    const data = editor.getData();
                    onChange(data);
                }}
            />
            <div className="max-h-96 md:max-h-none overflow-y-auto"></div>
        </div>
    );
};

export default CKEditorPro;
