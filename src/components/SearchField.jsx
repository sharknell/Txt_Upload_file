import React from 'react';
import { TextField } from "@mui/material";

const SearchField = ({ searchQuery, setSearchQuery }) => {
    return (
        <TextField
            label="파일 내용 검색"
            variant="outlined"
            fullWidth
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ mt: 2 }}
        />
    );
};

export default SearchField;
