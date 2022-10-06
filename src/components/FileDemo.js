import React, { useRef } from 'react';
import { FileUpload } from 'primereact/fileupload';

const FileDemo = () => {
    const toast = useRef(null);

    const onUpload = () => {
        toast.current.show({ severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000 });
    }

    const onSelect = (data) => {
        console.log(data);
    }

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h5>Advanced</h5>
                    <FileUpload name="demo[]" onBeforeUpload={onSelect} url="./upload.php" onUpload={onUpload} multiple accept="image/*" maxFileSize={1000000} />

                    <h5>Basic</h5>
                    <FileUpload mode="basic" name="demo[]" url="./upload.php" accept="image/*" maxFileSize={1000000} onUpload={onUpload} />
                </div>
            </div>
        </div>
    )
}

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(FileDemo, comparisonFn);
