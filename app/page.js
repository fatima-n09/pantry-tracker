"use client";
import {
  Box,
  Button,
  Modal,
  Stack,
  TextField,
  Typography,
  List,
} from "@mui/material";
import { firestore } from "@/firebase";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  setDoc,
  query,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import Pantry from "./pantry";

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [itemCount, setItemCount] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const updateInventory = async () => {
    try {
      const snapshot = query(collection(firestore, "inventory"));
      const docs = await getDocs(snapshot);
      const inventoryList = [];
      docs.forEach((doc) => {
        inventoryList.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setInventory(inventoryList);
    } catch (error) {
      console.error("Error updating inventory: ", error);
    }
  };

  const addItem = async (item, count) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    await setDoc(docRef, { count });
    await updateInventory();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    await deleteDoc(docRef);
    await updateInventory();
  };

  const handleEdit = async (item, newName, newCount) => {
    const itemRef = doc(collection(firestore, "inventory"), item);
    const newItemRef = doc(collection(firestore, "inventory"), newName);

    if (item !== newName) {
      await deleteDoc(itemRef);
      await setDoc(newItemRef, { count: newCount });
    } else {
      await setDoc(itemRef, { count: newCount });
    }
    await updateInventory();
  };

  const increaseCount = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);
    const { count } = docSnap.data();
    await setDoc(docRef, { count: count + 1 });
    await updateInventory();
  };

  const decreaseCount = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);
    const { count } = docSnap.data();
    if (count > 1) {
      await setDoc(docRef, { count: count - 1 });
      await updateInventory();
    }
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => {
    setItemName("");
    setItemCount(1);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setIsEditing(false);
    setCurrentItem(null);
  };

  const handleEditClick = (item) => {
    setCurrentItem(item.id);
    setItemName(item.name);
    setItemCount(item.count);
    setIsEditing(true);
    setOpen(true);
  };

  const handleSubmit = () => {
    if (isEditing) {
      handleEdit(currentItem, itemName, itemCount);
    } else {
      addItem(itemName, itemCount);
    }
    handleClose();
  };

  const filteredInventory = inventory.filter((item) =>
    item.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box
      height="100vh"
      width="100vw"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap={2}
      p={2}
      sx={{ backgroundColor: "#333" }}
    >
      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={{ xs: 300, sm: 400 }}
          bgcolor="white"
          borderRadius={2}
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{
            transform: "translate(-50%, -50%)",
          }}
        >
          <Typography variant="h6" color="#333">
            {isEditing ? "Edit Item" : "Add Item"}
          </Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <TextField
              type="number"
              variant="outlined"
              value={itemCount}
              onChange={(e) => setItemCount(Number(e.target.value))}
            />
            <Button
              variant="outlined"
              onClick={handleSubmit}
              sx={{ backgroundColor: "blue", color: "white" }}
            >
              {isEditing ? "Edit" : "Add"}
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Box
        display="flex"
        width={{ xs: "100%", sm: "800px" }}
        justifyContent="space-between"
        mb={2}
      >
        <TextField
          variant="outlined"
          placeholder="Search items"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{
            width: "80%",
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "white",
              },
              "&:hover fieldset": {
                borderColor: "white",
              },
              "&.Mui-focused fieldset": {
                borderColor: "white",
              },
            },
            "& .MuiInputBase-input": {
              color: "white",
            },
            "& .MuiInputBase-input::placeholder": {
              color: "white",
            },
          }}
        />

        <Button
          variant="contained"
          onClick={handleOpen}
          sx={{ backgroundColor: "blue", color: "white" }}
        >
          Add New Item
        </Button>
      </Box>
      <Box
        width={{ xs: "100%", sm: "832px" }}
        border="1px solid #333"
        borderRadius={2}
        p={2}
      >
        <Box
          bgcolor="#0000ff"
          alignItems="center"
          justifyContent="center"
          display="flex"
          p={2}
        >
          <Typography variant="h2" color="#fff">
            Items
          </Typography>
        </Box>
        <List>
          {filteredInventory.map((item) => (
            <Pantry
              key={item.id}
              id={item.id}
              name={item.id}
              count={item.count}
              onDelete={removeItem}
              onEdit={handleEditClick}
              onIncrement={increaseCount}
              onDecrement={decreaseCount}
            />
          ))}
        </List>
      </Box>
    </Box>
  );
}
