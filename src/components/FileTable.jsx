import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, IconButton } from "@mui/material";
import { styled } from "@mui/system";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";

const Preformatted = styled("pre")(({ theme }) => ({
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    margin: 0,
    backgroundColor: theme.palette.background.default,
    color: theme.palette.text.primary,
}));

const FileTable = ({
                       files,
                       editingFileIndex,
                       setEditingFileIndex,
                       editingFileContent,
                       setEditingFileContent,
                       handleRemoveFile,
                       handleEditFile,
                       handleSaveEdit
                   }) => {
    return (
        <TableContainer component={Paper} sx={{ mt: 4 }}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>No.</TableCell>
                        <TableCell>File Name</TableCell>
                        <TableCell>File Content</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {files.map((file, index) => (
                        <TableRow key={index}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{file.name}</TableCell>
                            <TableCell>
                                {editingFileIndex === index ? (
                                    <TextField
                                        fullWidth
                                        multiline
                                        value={editingFileContent}
                                        onChange={(e) =>
                                            setEditingFileContent(e.target.value)
                                        }
                                    />
                                ) : (
                                    <Preformatted>{file.content}</Preformatted>
                                )}
                            </TableCell>
                            <TableCell>
                                {editingFileIndex === index ? (
                                    <IconButton
                                        edge="end"
                                        aria-label="save"
                                        onClick={() => handleSaveEdit(index)}
                                    >
                                        <SaveIcon />
                                    </IconButton>
                                ) : (
                                    <>
                                        <IconButton
                                            edge="end"
                                            aria-label="edit"
                                            onClick={() => handleEditFile(index)}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            edge="end"
                                            aria-label="delete"
                                            onClick={() => handleRemoveFile(index)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default FileTable;
