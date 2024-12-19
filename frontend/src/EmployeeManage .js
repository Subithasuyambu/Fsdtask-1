import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, MenuItem, Select, InputLabel, FormControl, Snackbar, Table, TableBody, TableCell, TableHead, TableRow, Paper } from '@mui/material';

const API_URL = 'http://localhost:5000/api/employees';

const EmployeeAdd = () => {
  const [formData, setFormData] = useState({
    name: '',
    employee_id: '',
    email: '',
    phone_number: '',
    department: '',
    date_of_joining: '',
    role: '',
  });
  const [employees, setEmployees] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Validate form data
  const validateForm = () => {
    const { name, employee_id, email, phone_number, department, date_of_joining, role } = formData;
    if (!name || !employee_id || !email || !phone_number || !department || !date_of_joining || !role) {
      setSnackbarMessage('All fields are required');
      setOpenSnackbar(true);
      return false;
    }
    if (!/^\d{10}$/.test(phone_number)) {
      setSnackbarMessage('Phone number must be 10 digits');
      setOpenSnackbar(true);
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setSnackbarMessage('Invalid email format');
      setOpenSnackbar(true);
      return false;
    }
    return true;
  };

  // Handle submit form to add employee
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    axios
      .post(`${API_URL}/add`, formData)
      .then(() => {
        setSnackbarMessage('Employee added successfully');
        setOpenSnackbar(true);
        setFormData({
          name: '',
          employee_id: '',
          email: '',
          phone_number: '',
          department: '',
          date_of_joining: '',
          role: '',
        });
      })
      .catch((error) => {
        const message = error.response?.data?.message || 'Error adding employee';
        setSnackbarMessage(message);
        setOpenSnackbar(true);
        console.error('Error adding employee:', error);
      });
  };

  // Fetch all employees
  const fetchEmployees = () => {
    axios
      .get(`${API_URL}/all`)
      .then((response) => {
        setEmployees(response.data);
      })
      .catch((error) => {
        setSnackbarMessage('Error fetching employees');
        setOpenSnackbar(true);
        console.error('Error fetching employees:', error);
      });
  };

  // Reset employees
  const resetEmployees = () => {
    setEmployees([]);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
      <h1>Employee Management</h1>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Name"
          name="name"
          fullWidth
          value={formData.name}
          onChange={handleInputChange}
          required
          style={{ marginBottom: '10px' }}
        />
        <TextField
          label="Employee ID"
          name="employee_id"
          fullWidth
          value={formData.employee_id}
          onChange={handleInputChange}
          required
          style={{ marginBottom: '10px' }}
        />
        <TextField
          label="Email"
          name="email"
          type="email"
          fullWidth
          value={formData.email}
          onChange={handleInputChange}
          required
          style={{ marginBottom: '10px' }}
        />
        <TextField
          label="Phone Number"
          name="phone_number"
          fullWidth
          value={formData.phone_number}
          onChange={handleInputChange}
          required
          style={{ marginBottom: '10px' }}
        />
        <FormControl fullWidth style={{ marginBottom: '10px' }}>
          <InputLabel>Department</InputLabel>
          <Select
            name="department"
            value={formData.department}
            onChange={handleInputChange}
            required
          >
            <MenuItem value="HR">HR</MenuItem>
            <MenuItem value="Engineering">Engineering</MenuItem>
            <MenuItem value="Marketing">Marketing</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Date of Joining"
          name="date_of_joining"
          type="date"
          fullWidth
          value={formData.date_of_joining}
          onChange={handleInputChange}
          required
          InputLabelProps={{ shrink: true }}
          style={{ marginBottom: '10px' }}
        />
        <TextField
          label="Role"
          name="role"
          fullWidth
          value={formData.role}
          onChange={handleInputChange}
          required
          style={{ marginBottom: '10px' }}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            style={{ flex: 1, margin: '0 5px' }}
          >
            Add Employee
          </Button>
          <Button
            variant="contained"
            color="secondary"
            style={{ flex: 1, margin: '0 5px' }}
            onClick={fetchEmployees}
          >
            Show Employees
          </Button>
          <Button
            variant="outlined"
            color="default"
            style={{ flex: 1, margin: '0 5px' }}
            onClick={resetEmployees}
          >
            Reset
          </Button>
        </div>
      </form>

      {employees.length > 0 && (
        <Paper style={{ marginTop: '20px' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Employee ID</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone Number</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Date of Joining</TableCell>
                <TableCell>Role</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employees.map((employee) => (
                <TableRow key={employee.employee_id}>
                  <TableCell>{employee.name}</TableCell>
                  <TableCell>{employee.employee_id}</TableCell>
                  <TableCell>{employee.email}</TableCell>
                  <TableCell>{employee.phone_number}</TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell>{employee.date_of_joining}</TableCell>
                  <TableCell>{employee.role}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        message={snackbarMessage}
      />
    </div>
  );
};

export default EmployeeAdd;
