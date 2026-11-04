
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Students() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [editingId, setEditingId] = useState(null);

    const [form, setForm] = useState({
        name: '',
        email: '',
        age: '',
        isActive: true
    });

    const navigate = useNavigate();

    const API_URL = 'http://localhost:3000/api/students';

    // GET STUDENTS
    const fetchStudents = async () => {
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                navigate('/login');
                return;
            }

            const response = await fetch(API_URL, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to load students.');
            }

            setStudents(Array.isArray(data) ? data : data.students || []);
            setError('');

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    // HANDLE INPUT
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setForm({
            ...form,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    // RESET FORM
    const resetForm = () => {
        setForm({
            name: '',
            email: '',
            age: '',
            isActive: true
        });

        setEditingId(null);
    };

    // ADD OR UPDATE STUDENT
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const token = localStorage.getItem('token');

            const studentData = {
                name: form.name.trim(),
                email: form.email.trim(),
                age: form.age === '' ? undefined : Number(form.age),
                isActive: form.isActive
            };

            const url = editingId
                ? `${API_URL}/${editingId}`
                : API_URL;

            const method = editingId ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(studentData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Unable to save student.');
            }

            alert(
                editingId
                    ? 'Student updated successfully!'
                    : 'Student added successfully!'
            );

            resetForm();
            await fetchStudents();

        } catch (err) {
            setError(err.message);
        }
    };

    // EDIT STUDENT
    const handleEdit = (student) => {
        setEditingId(student._id);

        setForm({
            name: student.name || '',
            email: student.email || '',
            age: student.age ?? '',
            isActive: student.isActive ?? true
        });

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    // DELETE STUDENT
    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            'Are you sure you want to delete this student?'
        );

        if (!confirmed) return;

        try {
            const token = localStorage.getItem('token');

            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Unable to delete student.');
            }

            alert('Student deleted successfully!');
            await fetchStudents();

        } catch (err) {
            setError(err.message);
        }
    };

    // LOGOUT
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    // SEARCH STUDENTS
    const filteredStudents = students.filter((student) =>
        student.name?.toLowerCase().includes(search.toLowerCase()) ||
        student.email?.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
        return <h2 style={{ padding: '30px' }}>Loading students...</h2>;
    }

    return (
        <div style={styles.container}>

            <header style={styles.header}>
                <div>
                    <h1 style={styles.title}>Student Directory</h1>
                    <p style={styles.subtitle}>
                        Manage your student records
                    </p>
                </div>

                <button
                    onClick={handleLogout}
                    style={styles.logoutButton}
                >
                    Logout
                </button>
            </header>

            {error && (
                <div style={styles.error}>
                    {error}
                </div>
            )}

            <div style={styles.stats}>
                <div style={styles.statCard}>
                    <h2>{students.length}</h2>
                    <p>Total Students</p>
                </div>

                <div style={styles.statCard}>
                    <h2>{students.filter(s => s.isActive).length}</h2>
                    <p>Active Students</p>
                </div>
            </div>

            {/* ADD / EDIT FORM */}
            <section style={styles.section}>
                <h2>{editingId ? 'Edit Student' : 'Add New Student'}</h2>

                <form onSubmit={handleSubmit} style={styles.form}>

                    <input
                        type="text"
                        name="name"
                        placeholder="Student Name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        style={styles.input}
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Student Email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        style={styles.input}
                    />

                    <input
                        type="number"
                        name="age"
                        placeholder="Age"
                        value={form.age}
                        onChange={handleChange}
                        min="1"
                        style={styles.input}
                    />

                    <label style={styles.checkboxLabel}>
                        <input
                            type="checkbox"
                            name="isActive"
                            checked={form.isActive}
                            onChange={handleChange}
                        />
                        Active Student
                    </label>

                    <div style={styles.actions}>
                        <button type="submit" style={styles.primaryButton}>
                            {editingId ? 'Update Student' : 'Add Student'}
                        </button>

                        {editingId && (
                            <button
                                type="button"
                                onClick={resetForm}
                                style={styles.cancelButton}
                            >
                                Cancel
                            </button>
                        )}
                    </div>

                </form>
            </section>

            {/* STUDENT LIST */}
            <section style={styles.section}>
                <h2>Student Records</h2>

                <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={styles.searchInput}
                />

                {filteredStudents.length === 0 ? (
                    <p style={styles.empty}>
                        {students.length === 0
                            ? 'No students found. Add your first student!'
                            : 'No matching students found.'}
                    </p>
                ) : (
                    <div style={styles.tableWrapper}>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th style={styles.th}>Name</th>
                                    <th style={styles.th}>Email</th>
                                    <th style={styles.th}>Age</th>
                                    <th style={styles.th}>Status</th>
                                    <th style={styles.th}>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredStudents.map((student) => (
                                    <tr key={student._id}>
                                        <td style={styles.td}>
                                            {student.name}
                                        </td>

                                        <td style={styles.td}>
                                            {student.email}
                                        </td>

                                        <td style={styles.td}>
                                            {student.age ?? 'N/A'}
                                        </td>

                                        <td style={styles.td}>
                                            {student.isActive
                                                ? 'Active'
                                                : 'Inactive'}
                                        </td>

                                        <td style={styles.td}>
                                            <button
                                                onClick={() => handleEdit(student)}
                                                style={styles.editButton}
                                            >
                                                Edit
                                            </button>

                                            <button
                                                onClick={() => handleDelete(student._id)}
                                                style={styles.deleteButton}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

        </div>
    );
}

const styles = {
    container: {
        minHeight: '100vh',
        background: '#f3f4f6',
        padding: '30px',
        fontFamily: 'Arial, sans-serif',
        color: '#1f2937'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '15px',
        marginBottom: '30px'
    },
    title: {
        margin: 0,
        fontSize: '30px'
    },
    subtitle: {
        color: '#6b7280'
    },
    logoutButton: {
        background: '#dc2626',
        color: 'white',
        border: 'none',
        padding: '12px 22px',
        borderRadius: '6px',
        cursor: 'pointer'
    },
    stats: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '20px',
        marginBottom: '25px'
    },
    statCard: {
        background: 'white',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
    },
    section: {
        background: 'white',
        padding: '25px',
        borderRadius: '10px',
        marginBottom: '25px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        maxWidth: '500px'
    },
    input: {
        padding: '12px',
        border: '1px solid #d1d5db',
        borderRadius: '6px',
        fontSize: '15px',
        width: '100%',
        boxSizing: 'border-box'
    },
    checkboxLabel: {
        display: 'flex',
        gap: '10px',
        alignItems: 'center'
    },
    actions: {
        display: 'flex',
        gap: '10px',
        flexWrap: 'wrap'
    },
    primaryButton: {
        background: '#2563eb',
        color: 'white',
        border: 'none',
        padding: '12px 20px',
        borderRadius: '6px',
        cursor: 'pointer'
    },
    cancelButton: {
        background: '#6b7280',
        color: 'white',
        border: 'none',
        padding: '12px 20px',
        borderRadius: '6px',
        cursor: 'pointer'
    },
    searchInput: {
        width: '100%',
        maxWidth: '450px',
        padding: '12px',
        border: '1px solid #d1d5db',
        borderRadius: '6px',
        marginBottom: '20px',
        boxSizing: 'border-box'
    },
    tableWrapper: {
        width: '100%',
        overflowX: 'auto'
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        textAlign: 'left'
    },
    th: {
        padding: '14px',
        background: '#f3f4f6',
        borderBottom: '1px solid #e5e7eb'
    },
    td: {
        padding: '14px',
        borderBottom: '1px solid #e5e7eb'
    },
    editButton: {
        background: '#2563eb',
        color: 'white',
        border: 'none',
        padding: '8px 12px',
        borderRadius: '5px',
        marginRight: '5px',
        cursor: 'pointer'
    },
    deleteButton: {
        background: '#dc2626',
        color: 'white',
        border: 'none',
        padding: '8px 12px',
        borderRadius: '5px',
        cursor: 'pointer'
    },
    empty: {
        color: '#6b7280',
        padding: '20px 0'
    },
    error: {
        background: '#fee2e2',
        color: '#991b1b',
        padding: '12px',
        borderRadius: '6px',
        marginBottom: '20px'
    }
};

export default Students;
