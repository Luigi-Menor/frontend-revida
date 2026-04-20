import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Box,
    CircularProgress,
    Alert,
    Dialog,
    TextField,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import { useFamiliesStore } from '../store/familiesStore';

export const FamiliesPage = () => {
    const navigate = useNavigate();
    const {
        families,
        isLoading,
        error,
        pagination,
        fetchFamilies,
        createFamily,
        deactivateFamily,
        clearError,
    } = useFamiliesStore();

    const [openDialog, setOpenDialog] = useState(false);
    const [formData, setFormData] = useState({
        headOfFamily: '',
        municipio: '',
        latitude: '',
        longitude: '',
    });

    useEffect(() => {
        fetchFamilies(0, 20);
    }, []);

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setFormData({ headOfFamily: '', municipio: '', latitude: '', longitude: '' });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCreateFamily = async () => {
        if (!formData.headOfFamily || !formData.municipio) {
            alert('Por favor completa los campos requeridos');
            return;
        }

        try {
            await createFamily({
                headOfFamily: formData.headOfFamily,
                municipio: formData.municipio,
                latitude: formData.latitude ? parseFloat(formData.latitude) : null,
                longitude: formData.longitude ? parseFloat(formData.longitude) : null,
            });
            handleCloseDialog();
            fetchFamilies(0, 20);
        } catch (err) {
            console.error('Error al crear familia:', err);
        }
    };

    const handleViewFamily = (familyId) => {
        navigate(`/families/${familyId}`);
    };

    const handleDeactivate = async (familyId) => {
        if (window.confirm('¿Estás seguro de que deseas desactivar esta familia?')) {
            await deactivateFamily(familyId);
            fetchFamilies(0, 20);
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>📋 Gestión de Familias</h1>
                <Button variant="contained" color="primary" onClick={handleOpenDialog}>
                    + Nueva Familia
                </Button>
            </Box>

            {error && (
                <Alert severity="error" onClose={clearError} sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: '#0D4A2A' }}>
                                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Código</TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Jefe de Familia</TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Municipio</TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Miembros</TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Casos</TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Acciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {families.map((family, index) => (
                                    <TableRow key={family.id} sx={{ backgroundColor: index % 2 === 0 ? '#f5f5f5' : 'white' }}>
                                        <TableCell>
                                            <strong>{family.familyCode}</strong>
                                        </TableCell>
                                        <TableCell>{family.headOfFamily}</TableCell>
                                        <TableCell>{family.municipio}</TableCell>
                                        <TableCell>{family.members?.length || 0}</TableCell>
                                        <TableCell>{family.cases?.length || 0}</TableCell>
                                        <TableCell>
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                onClick={() => handleViewFamily(family.id)}
                                                sx={{ mr: 1 }}
                                            >
                                                Ver
                                            </Button>
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                color="error"
                                                onClick={() => handleDeactivate(family.id)}
                                            >
                                                Desactivar
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                        <p>
                            Página {pagination.page} de {pagination.pages} | Total: {pagination.total} familias
                        </p>
                    </Box>
                </>
            )}

            {/* Dialog para crear familia */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>Crear Nueva Familia</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                        <TextField
                            label="Jefe de Familia"
                            name="headOfFamily"
                            value={formData.headOfFamily}
                            onChange={handleInputChange}
                            fullWidth
                            required
                        />
                        <TextField
                            label="Municipio"
                            name="municipio"
                            value={formData.municipio}
                            onChange={handleInputChange}
                            fullWidth
                            required
                        />
                        <TextField
                            label="Latitud (opcional)"
                            name="latitude"
                            type="number"
                            value={formData.latitude}
                            onChange={handleInputChange}
                            fullWidth
                        />
                        <TextField
                            label="Longitud (opcional)"
                            name="longitude"
                            type="number"
                            value={formData.longitude}
                            onChange={handleInputChange}
                            fullWidth
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancelar</Button>
                    <Button onClick={handleCreateFamily} variant="contained" color="primary">
                        Crear
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};