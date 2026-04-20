import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Paper,
    Button,
    Box,
    CircularProgress,
    Alert,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Dialog,
    TextField,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
} from '@mui/material';
import { useFamiliesStore } from '../store/familiesStore';

export const FamilyDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentFamily, isLoading, error, fetchFamilyById, addMember, updateFamily } = useFamiliesStore();

    const [openAddMember, setOpenAddMember] = useState(false);
    const [memberData, setMemberData] = useState({
        fullName: '',
        cedula: '',
        relationship: '',
        age: '',
    });

    useEffect(() => {
        if (id) {
            fetchFamilyById(id);
        }
    }, [id]);

    const handleOpenAddMember = () => {
        setOpenAddMember(true);
    };

    const handleCloseAddMember = () => {
        setOpenAddMember(false);
        setMemberData({ fullName: '', cedula: '', relationship: '', age: '' });
    };

    const handleMemberInputChange = (e) => {
        const { name, value } = e.target;
        setMemberData((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddMember = async () => {
        if (!memberData.fullName || !memberData.cedula || !memberData.relationship) {
            alert('Por favor completa los campos requeridos');
            return;
        }

        try {
            await addMember(id, {
                ...memberData,
                age: memberData.age ? parseInt(memberData.age) : null,
            });
            handleCloseAddMember();
            fetchFamilyById(id); // Recargar
        } catch (err) {
            console.error('Error al agregar miembro:', err);
        }
    };

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Alert severity="error">{error}</Alert>
                <Button onClick={() => navigate('/families')} sx={{ mt: 2 }}>
                    Volver a familias
                </Button>
            </Container>
        );
    }

    if (!currentFamily) {
        return (
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Alert severity="info">Familia no encontrada</Alert>
                <Button onClick={() => navigate('/families')} sx={{ mt: 2 }}>
                    Volver a familias
                </Button>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Button onClick={() => navigate('/families')} sx={{ mb: 2 }}>
                ← Volver a familias
            </Button>

            <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
                <Typography variant="h4" gutterBottom>
                    {currentFamily.familyCode}
                </Typography>

                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, mb: 4 }}>
                    <div>
                        <strong>Jefe de Familia:</strong> {currentFamily.headOfFamily}
                    </div>
                    <div>
                        <strong>Municipio:</strong> {currentFamily.municipio}
                    </div>
                    <div>
                        <strong>Latitud:</strong> {currentFamily.latitude || 'No definida'}
                    </div>
                    <div>
                        <strong>Longitud:</strong> {currentFamily.longitude || 'No definida'}
                    </div>
                    <div>
                        <strong>Estado:</strong> {currentFamily.isActive ? '✅ Activa' : '❌ Inactiva'}
                    </div>
                    <div>
                        <strong>Registrada:</strong> {new Date(currentFamily.createdAt).toLocaleDateString()}
                    </div>
                </Box>
            </Paper>

            {/* Miembros */}
            <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
                <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h5">👥 Miembros de la Familia</Typography>
                    <Button variant="contained" color="primary" onClick={handleOpenAddMember}>
                        + Agregar Miembro
                    </Button>
                </Box>

                {currentFamily.members && currentFamily.members.length > 0 ? (
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: '#1B6B3A' }}>
                                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Nombre</TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Parentesco</TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Edad</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {currentFamily.members.map((member) => (
                                    <TableRow key={member.id}>
                                        <TableCell>{member.fullName}</TableCell>
                                        <TableCell>{member.relationship}</TableCell>
                                        <TableCell>{member.age || 'N/A'}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                ) : (
                    <Alert severity="info">No hay miembros registrados</Alert>
                )}
            </Paper>

            {/* Casos */}
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h5" gutterBottom>
                    📌 Casos Abiertos
                </Typography>

                {currentFamily.cases && currentFamily.cases.length > 0 ? (
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: '#1B6B3A' }}>
                                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Tipo de Caso</TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Estado</TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Prioridad</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {currentFamily.cases.map((caseItem) => (
                                    <TableRow key={caseItem.id}>
                                        <TableCell>{caseItem.caseType}</TableCell>
                                        <TableCell>{caseItem.state}</TableCell>
                                        <TableCell>{caseItem.priority}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                ) : (
                    <Alert severity="info">No hay casos abiertos</Alert>
                )}
            </Paper>

            {/* Dialog para agregar miembro */}
            <Dialog open={openAddMember} onClose={handleCloseAddMember} maxWidth="sm" fullWidth>
                <DialogTitle>Agregar Miembro a la Familia</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                        <TextField
                            label="Nombre Completo"
                            name="fullName"
                            value={memberData.fullName}
                            onChange={handleMemberInputChange}
                            fullWidth
                            required
                        />
                        <TextField
                            label="Cédula"
                            name="cedula"
                            value={memberData.cedula}
                            onChange={handleMemberInputChange}
                            fullWidth
                            required
                        />
                        <TextField
                            label="Parentesco (ej: Esposa, Hijo, Padre...)"
                            name="relationship"
                            value={memberData.relationship}
                            onChange={handleMemberInputChange}
                            fullWidth
                            required
                        />
                        <TextField
                            label="Edad (opcional)"
                            name="age"
                            type="number"
                            value={memberData.age}
                            onChange={handleMemberInputChange}
                            fullWidth
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseAddMember}>Cancelar</Button>
                    <Button onClick={handleAddMember} variant="contained" color="primary">
                        Agregar
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};