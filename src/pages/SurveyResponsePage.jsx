import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Paper,
    Button,
    Box,
    CircularProgress,
    Alert,
    Typography,
} from '@mui/material';
import { useSurveysStore } from '../store/surveysStore';
import { useFamiliesStore } from '../store/familiesStore';
import { SurveyForm } from '../components/SurveyForm';

export const SurveyResponsePage = () => {
    const { familyId } = useParams();
    const navigate = useNavigate();
    const { fetchTemplates, templates } = useSurveysStore();
    const { currentFamily, fetchFamilyById } = useFamiliesStore();

    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [answers, setAnswers] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchFamilyById(familyId);
        fetchTemplates();
    }, [familyId]);

    const handleTemplateSelect = (template) => {
        setSelectedTemplate(template);
        setAnswers({});
    };

    const handleAnswerChange = (fieldId, value) => {
        setAnswers((prev) => ({ ...prev, [fieldId]: value }));
    };

    const handleSubmit = async (status) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('http://localhost:3000/api/v1/surveys/responses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
                body: JSON.stringify({
                    familyId,
                    templateId: selectedTemplate.id,
                    answers,
                    status,
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Error al guardar encuesta');
            }

            navigate(`/families/${familyId}`);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (!currentFamily) {
        return (
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <CircularProgress />
            </Container>
        );
    }

    if (!selectedTemplate) {
        return (
            <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
                <Button onClick={() => navigate(`/families/${familyId}`)} sx={{ mb: 2 }}>
                    ← Volver
                </Button>

                <Paper elevation={3} sx={{ p: 4 }}>
                    <Typography variant="h5" sx={{ mb: 3 }}>
                        Seleccionar Encuesta para: <strong>{currentFamily.familyCode}</strong>
                    </Typography>

                    {templates.map((template) => (
                        <Box
                            key={template.id}
                            onClick={() => handleTemplateSelect(template)}
                            sx={{
                                p: 2,
                                mb: 2,
                                border: '1px solid #ddd',
                                borderRadius: 1,
                                cursor: 'pointer',
                                '&:hover': { backgroundColor: '#f5f5f5' },
                            }}
                        >
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                {template.name}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                {template.fields.length} campos | v{template.version}
                            </Typography>
                        </Box>
                    ))}
                </Paper>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Button
                onClick={() => setSelectedTemplate(null)}
                sx={{ mb: 2 }}
            >
                ← Cambiar encuesta
            </Button>

            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h5" sx={{ mb: 3 }}>
                    {selectedTemplate.name}
                </Typography>

                {error && (
                    <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <SurveyForm
                    fields={selectedTemplate.fields}
                    answers={answers}
                    onChange={handleAnswerChange}
                />

                <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
                    <Button
                        variant="outlined"
                        onClick={() => handleSubmit('draft')}
                        disabled={isLoading}
                    >
                        Guardar como Borrador
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleSubmit('completed')}
                        disabled={isLoading}
                    >
                        {isLoading ? <CircularProgress size={24} /> : 'Completar Encuesta'}
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};