import React, { useState, useCallback } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Container,
  Box,
  CssBaseline,
  Snackbar,
  Alert,
  IconButton,
  TextField,
  AppBar,
  Toolbar,
  Switch,
  FormControlLabel,
  createTheme,
  ThemeProvider,
  useMediaQuery,
} from "@mui/material";
import { styled } from "@mui/system";
import DownloadIcon from "@mui/icons-material/Download";
import RefreshIcon from "@mui/icons-material/Refresh";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
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

const Preformatted = styled("pre")(({ theme }) => ({
  whiteSpace: "pre-wrap",
  wordBreak: "break-word",
  margin: 0,
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary,
}));

const getFileNameWithoutExtension = (filename) => {
  return filename.replace(/\.[^/.]+$/, "");
};

const getCurrentDateTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hour = String(now.getHours()).padStart(2, "0");
  const minute = String(now.getMinutes()).padStart(2, "0");
  return `${year}${month}${day}_${hour}${minute}`;
};

const FileUpload = () => {
  const [files, setFiles] = useState([]);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [editingFileIndex, setEditingFileIndex] = useState(null);
  const [editingFileContent, setEditingFileContent] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [darkMode, setDarkMode] = useState(prefersDarkMode);

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
    },
  });

  const handleFileRead = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve({
          name: getFileNameWithoutExtension(file.name),
          content: e.target.result,
        });
      };
      reader.onerror = (e) => {
        reject(e);
      };
      reader.readAsText(file);
    });
  };

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    const txtFiles = acceptedFiles.filter((file) => file.type === "text/plain");
    const readFiles = txtFiles.map(handleFileRead);

    Promise.all(readFiles)
        .then((fileContents) => {
          setFiles((prevFiles) => [...prevFiles, ...fileContents]);
        })
        .catch((error) => {
          console.error("파일 읽기 오류: ", error);
        });

    if (rejectedFiles.length > 0 || txtFiles.length !== acceptedFiles.length) {
      setAlertMessage("TXT 파일만 업로드할 수 있습니다. 다시 시도해주세요.");
      setAlertOpen(true);
    }
  }, []);

  const handleDownloadComplete = () => {
    setAlertMessage("CSV 다운로드가 완료되었습니다.");
    setAlertOpen(true);
  };

  const downloadCSV = () => {
    const csvContent = [
      ["No.", "File Name", "File Content"],
      ...files.map((file, index) => [
        index + 1,
        file.name,
        file.content.replace(/"/g, '""'),
      ]),
    ]
        .map((e) => e.map((a) => `"${a}"`).join(","))
        .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute(
        "download",
        `merge ${getCurrentDateTime().replace("_", "_")}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    handleDownloadComplete();
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: ".txt",
  });

  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  const handleRefresh = () => {
    setFiles([]);
    setSearchQuery("");
  };

  const handleRemoveFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleEditFile = (index) => {
    setEditingFileIndex(index);
    setEditingFileContent(files[index].content);
  };

  const handleSaveEdit = (index) => {
    const updatedFiles = [...files];
    updatedFiles[index].content = editingFileContent;
    setFiles(updatedFiles);
    setEditingFileIndex(null);
  };

  const handleThemeChange = () => {
    setDarkMode(!darkMode);
  };

  const filteredFiles = files.filter((file) =>
      file.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container maxWidth="md">
          <Box sx={{ my: 4, textAlign: "center" }}>
            <AppBar position="static">
              <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                  TXT 파일 업로드 및 CSV 다운로드
                </Typography>
                <FormControlLabel
                    control={
                      <Switch
                          checked={darkMode}
                          onChange={handleThemeChange}
                          name="themeSwitch"
                      />
                    }
                    label="다크 모드"
                />
              </Toolbar>
            </AppBar>
            <DropzoneContainer {...getRootProps()}>
              <input {...getInputProps()} />
              <Typography variant="body1">
                파일을 이곳에 드래그 앤 드롭 하거나 클릭하여 업로드하세요.
              </Typography>
            </DropzoneContainer>
            <TextField
                label="파일 내용 검색"
                variant="outlined"
                fullWidth
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{ mt: 2 }}
            />
            <Box
                sx={{ mt: 2, display: "flex", justifyContent: "center", gap: 2 }}
            >
              {files.length > 0 && (
                  <>
                    <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<DownloadIcon />}
                        onClick={downloadCSV}
                    >
                      CSV 다운로드
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<RefreshIcon />}
                        onClick={handleRefresh}
                    >
                      새로 고침
                    </Button>
                  </>
              )}
            </Box>
          </Box>
          {filteredFiles.length > 0 && (
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
                    {filteredFiles.map((file, index) => (
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
          )}
          <Snackbar
              open={alertOpen}
              autoHideDuration={6000}
              onClose={handleAlertClose}
          >
            <Alert
                onClose={handleAlertClose}
                severity="error"
                sx={{ width: "100%" }}
            >
              {alertMessage}
            </Alert>
          </Snackbar>
        </Container>
      </ThemeProvider>
  );
};

export default FileUpload;
