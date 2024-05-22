import React from "react";
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/system";
import { useDropzone } from "react-dropzone";

const DropzoneContainer = styled(Box)(({ theme }) => ({
    border: "2px dashed #cccccc",
    padding: theme.spacing(4),
    textAlign: "center",
    cursor: "pointer",
    backgroundColor: theme.palette.background.default,
    "&:hover": {
        backgroundColor: theme.palette.action.hover,
    },
}));

const DropzoneArea = ({ onDrop }) => {
    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: "*",
    });

    return (
        <DropzoneContainer {...getRootProps()}>
            <input {...getInputProps()} />
            <Typography variant="body1">
                파일을 이곳에 드래그 앤 드롭 하거나 클릭하여 업로드하세요.
            </Typography>
        </DropzoneContainer>
    );
};

export default DropzoneArea;
