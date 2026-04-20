import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Paper,
    Button,
    Box,
    CircularProgress,
    Alert,
    Dialog,
    TextField,
    DialogTitle,
    DialogContent,
    DialogActions,
    Card,
    CardContent,
    CardActions,
    Typography,
} from '@mui/material';
import { useSurveysStore } from '../store/surveysStore';

export const SurveyTemplatesPage = () => {
    const navigate = useNavigate();
    const {
        templates,
        isLoading,
        error,
        fetchTemplates,
        createTemplate,
        clearError,
    } = useSurveysStore();

    const [openDialog, setOpenDialog] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        fields: [
            {
                id: 'situation',
                label: '¿Cuál es tu situación actual?',
                type: 'select',
                required: true,
                options: ['Desplazada', 'Retornada', 'Reubicada'],
            },
            {
                id: 'hasHome',
                label: '¿Tienes vivienda propia?',
                type: 'radio',
                required: true,
                options: ['Sí', 'No'],
            },
        ],
    });

    useEffect(() => {
        fetchTemplates();
    }, []);

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setFormData({
            name: '',
            fields: [],
        });
    };

    const handleNameChange = (e) => {
        setFormData((prev) => ({ ...prev, name: e.target.value }));
    };

    const handleCreateTemplate = async () => {
        if (!formData.name || formData.fields.length === 0) {
            alert('Por favor completa el nombre y al menos un campo');
            return;
        }

        try {
            await createTemplate(formData);
            handleCloseDialog();
            fetchTemplates();
        } catch (err) {
            console.error('Error al crear template:', err);
        }
    };

    const handleEditTemplate = (templateId) => {
        navigate(`/surveys/templates/${templateId}`);
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>📋 Templates de Encuestas</h1>
                <Button variant="contained" color="primary" onClick={handleOpenDialog}>
                    + Nuevo Template
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
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 3 }}>
                    {templates.map((template) => (
                        <Card key={template.id} sx={{ cursor: 'pointer', '&:hover': { boxShadow: 4 } }}>
                            <CardContent>
                                <Typography variant="h6" component="div">
                                    {template.name}
                                </Typography>
                                <Typography sx={{ color: 'text.secondary', mb: 1 }}>
                                    v{template.version}
                                </Typography>
                                <Typography variant="body2">
                                    {template.fields.length} campos
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button
                                    size="small"
                                    onClick={() => handleEditTemplate(template.id)}
                                >
                                    Editar
                                </Button>
                            </CardActions>
                        </Card>
                    ))}
                </Box>
            )}

            {/* Dialog para crear template */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>Crear Nuevo Template</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                        <TextField
                            label="Nombre del Template"
                            value={formData.name}
                            onChange={handleNameChange}
                            fullWidth
                            required
                        />
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            Los templates predefinidos incluyen campos de diagnóstico. Puedes editarlos después.
                        </Typography>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancelar</Button>
                    <Button onClick={handleCreateTemplate} variant="contained" color="primary">
                        Crear
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};