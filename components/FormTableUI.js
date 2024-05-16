// components/FormTableUI.js

"use client";

import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Modal, Box, Typography } from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

let editid = '';

const initialFormData = {
  name: '',
  phoneNumber: '',
  email: '',
  hobbies: ''
};

export default function Home() {
  const [formData, setFormData] = useState(initialFormData);
  const [tableData, setTableData] = useState([]);
  const [open, setOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: '',
    phone: '',
    email: '',
    hobbies: ''
  });

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  
  const handleSetEditData = (data) => {
    setEditFormData({ name: data.name, phone: data.phone, email: data.email, hobbies: data.hobbies});
    editid = data._id;
  };

  const fetchData = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/getData');
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const jsonData = await response.json();
            setTableData(jsonData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

  useEffect(() => { 
    fetchData();
}, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSave = async () => {

    if(!formData.name || !formData.email || !formData.phoneNumber || !formData.hobbies){
        toast.error("Please fill out all required fields.");
        return;
    }

    const re = /\S+@\S+\.\S+/;
    if(!re.test(formData.email)){
        toast.error("Please enter a valid email address.");
        return;
    }

    const ph_no = /^\d{10}$/; // Assuming the phone number is 10 digits long
    if(!ph_no.test(formData.phoneNumber)){
        toast.error("Please enter a valid phone number.");
        return;
    }

    try {
        const response = await fetch('http://localhost:3001/api/saveData', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            console.log('Data saved successfully');
            toast.success("Record saved successfully.");
            setFormData(initialFormData);
            fetchData();
        } else {
            console.error('Failed to save data');
        }
    } catch (error) {
        console.error('Error:', error);
    }

  };

  const handleDelete = (id) => {
    fetch(`http://localhost:3001/api/deletedata/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Data deleted successfully:', data);
        toast.success("Record deleted successfully.");
        fetchData();
      })
      .catch(error => {
        console.error('There was a problem with the delete request:', error);
        toast.error("Error deleting data.");
      });
  };

  const handleEditInputChange = (event) => {
    const { name, value } = event.target;
    setEditFormData({
      ...editFormData,
      [name]: value,
    });
  };

  const handleEdit = () => {

    fetch(`http://localhost:3001/api/updatedata/${editid}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editFormData)
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Data updated successfully:', data);
        toast.success('Record updated successfully.');
        handleClose();
        fetchData();
      })
      .catch(error => {
        toast.error('Error updating record.');
        console.error('There was a problem with the delete request:', error);
      });
  };

  const handleSendMail = async (rec_data) => {

    const text = "Username: " + rec_data.name + "\n" + "Phone Number: " + rec_data.phone + "\n" + "Email: " + rec_data.email + "\n"
                 + "Hobbies: " + rec_data.hobbies;

    try {
        const response = await fetch('http://localhost:3001/api/sendmail', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ subject : 'Record Details', text : text })
        });
    
        if (response.ok) {
          toast.success('Email sent successfully');
        } else {
          throw new Error('Failed to send email');
        }
      } catch (error) {
        toast.error('Failed to send email');
        console.error('Error sending email:', error);
      }

  };

  return (
    <Container maxWidth="lg">
      <div className="mb-4" style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
        <TextField
          name="name"
          label="Name"
          value={formData.name}
          onChange={handleInputChange}
          className="mr-4"
          required
        />
        <TextField
          name="phoneNumber"
          label="Phone Number"
          value={formData.phoneNumber}
          onChange={handleInputChange}
          className="mr-4"
          required
        />
        <TextField
          name="email"
          label="Email"
          value={formData.email}
          onChange={handleInputChange}
          className="mr-4"
          required
        />
        <TextField
          name="hobbies"
          label="Hobbies"
          value={formData.hobbies}
          onChange={handleInputChange}
          className="mr-4"
          required
        />
        <Button variant="contained" onClick={handleSave} style={{maxWidth : '25px'}}>Save</Button>
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-edit"
        aria-describedby="modal-modal-edit-data"
        >
        <Box sx={style}>

            <Typography id="modal-modal-edit" variant="h6" component="h2">
            Edit Record
          </Typography>
          <TextField
            id="name"
            name="name"
            label="Name"
            variant="outlined"
            value={editFormData.name}
            onChange={handleEditInputChange}
            fullWidth
            sx={{ mt: 2 }}
            required
          />
          <TextField
            id="phone"
            name="phone"
            label="Phone Number"
            variant="outlined"
            value={editFormData.phone}
            onChange={handleEditInputChange}
            fullWidth
            sx={{ mt: 2 }}
            required
          />
          <TextField
            id="email"
            name="email"
            label="Email"
            variant="outlined"
            value={editFormData.email}
            onChange={handleEditInputChange}
            fullWidth
            sx={{ mt: 2 }}
            required
          />
          <TextField
            id="hobbies"
            name="hobbies"
            label="Hobbies"
            variant="outlined"
            value={editFormData.hobbies}
            onChange={handleEditInputChange}
            fullWidth
            sx={{ mt: 2 }}
            required
          />
          <Button onClick={handleEdit} sx={{ mt: 2 }} variant="contained">Update</Button>
        </Box>
        </Modal>
      <br/>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Phone Number</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Hobbies</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{index+1}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.phone}</TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>{row.hobbies}</TableCell>
                <TableCell>
                  <IconButton aria-label="edit" onClick={() => {handleOpen(); handleSetEditData(row);}}>
                    <EditIcon />
                  </IconButton>
                  <IconButton aria-label="delete" onClick={() => handleDelete(row._id)}>
                    <DeleteIcon />
                  </IconButton>
                  <IconButton aria-label="send-mail" onClick={() => handleSendMail(row)}>
                    <MailOutlineIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
