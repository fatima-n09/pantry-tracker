import React from "react";
import {
  ListItem,
  ListItemText,
  IconButton,
  TextField,
  Box,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

const Pantry = ({
  id,
  name,
  count,
  onDelete,
  onEdit,
  onIncrement,
  onDecrement,
}) => {
  return (
    <ListItem
      sx={{
        bgcolor: "background.paper",
        borderRadius: 1,
        my: 1,
        display: "flex",
        alignItems: "center",
      }}
    >
      <Box sx={{ flexGrow: 1 }}>
        <ListItemText
          primary={name}
          primaryTypographyProps={{ variant: "h6", sx: { color: "black" } }}
        />
      </Box>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <IconButton onClick={() => onDecrement(id)} sx={{ color: "red" }}>
          <RemoveIcon />
        </IconButton>
        <TextField
          value={count}
          variant="outlined"
          size="small"
          InputProps={{
            readOnly: true,
            sx: { textAlign: "center", width: 60 },
          }}
          sx={{ mx: 1 }}
        />
        <IconButton onClick={() => onIncrement(id)} sx={{ color: "blue" }}>
          <AddIcon />
        </IconButton>
        <IconButton
          onClick={() => onEdit({ id, name, count })}
          sx={{
            ml: 2,
            color: "green",
            "&:hover": { color: "darkgreen" },
          }}
        >
          <EditIcon />
        </IconButton>

        <IconButton
          onClick={() => onDelete(id)}
          sx={{
            ml: 1,
            color: "red",
            "&:hover": { color: "darkred" },
          }}
        >
          <DeleteIcon />
        </IconButton>
      </Box>
    </ListItem>
  );
};

export default Pantry;
