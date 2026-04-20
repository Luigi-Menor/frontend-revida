import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container, Paper, Button, Box, Typography, Alert, CircularProgress,
    Chip, Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, MenuItem, Select, InputLabel, FormControl, Stepper,
    Step, StepLabel, Divider,
} from '@mui/material';
import { useCasesStore } from '../store/casesStore';

// Re-declarar aquí para no depender del backend
const VALID_TRANSITIONS_FE = {
    nuevo: ['en_diagnostico', 'suspendido'],
    en_diagnostico: ['en_intervencion', 'suspendido'],
    en_intervencion: ['en_seguimiento', 'suspendido'],
    en_seguimiento: ['cerrado', 'en_intervencion', 'suspendido'],
    suspendido: ['nuevo'],
    cerrado: [],
};

const STATE_LABELS = {
    nuevo: '🆕 Nuevo',
    en_diagnostico: '🔍 Diagnóstico',
    en_intervencion: '🛠️ Intervención',
    en_seguimiento: '👁️ Seguimiento',
    cerrado: '✅ Cerrado',
    suspendido: '⏸️ Suspendido',
};

const STATE_COLORS = {
    nuevo: '#1565C0',
    en_diagnostico: '#6A1B9A',
    en_intervencion: '#E65100',
    en_seguimiento: '#1B5E20',
    cerrado: '#3E2723',
    suspendido: '#757575',
};

const ACTION_LABELS = {
    visita_campo: '🏠 Visita de campo',
    gestion_documental: '📄 Gestión documental',
    acompanamiento_juridico: '⚖️ Acompañamiento jurídico',
    atencion_psicosocial: '🧠 Atención psicosocial',
    coordinacion_interinstitucional: '🤝 Coordinación interinstitucional',
    seguimiento_telefonico: '📞 Seguimiento telefónico',
    cierre: '✅ Cierre',
};

const ACTION_TYPES = Object.keys(ACTION_LABELS);

export const CaseDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentCase, interventions, isLoading, error,
        fetchCaseById, transitionCase, addIntervention, clearError } = useCasesStore();

    const [openTransition, setOpenTransition] = useState(false);
    const [openIntervention, setOpenIntervention] = useState(false);
    const [transitionData, setTransitionData] = useState({ newState: '', reason: '' });
    const [interventionData, setInterventionData] = useState({ description: '', actionType: 'visita_campo' });

    useEffect(() => {
        if (id) fetchCaseById(id);
    }, [id]);

    const handleTransition = async () => {
        if (!transitionData.newState || !transitionData.reason) return;
        try {
            await transitionCase(id, transitionData.newState, transitionData.reason);
            setOpenTransition(false);
            fetchCaseById(id);
        } catch { }
    };

    const handleAddIntervention = async () => {
        if (!interventionData.description || !interventionData.actionType) return;
        try {
            await addIntervention(id, interventionData);
            setOpenIntervention(false);
            setInterventionData({ description: '', actionType: 'visita_campo' });
            fetchCaseById(id);
        } catch { }
    };

    if (isLoading || !currentCase) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>;
    }

    const nextStates = VALID_TRANSITIONS_FE[currentCase.state] || [];
    const isClosed = currentCase.state === 'cerrado';

    return (
        <Container maxWidth="lg" sx={{ mt: 3, mb: 4 }}>
            <Button onClick={() => navigate('/cases')} sx={{ mb: 2 }}>← Volver a casos</Button>

            {error && <Alert severity="error" onClose={clearError} sx={{ mb: 2 }}>{error}</Alert>}

            {/* Encabezado del caso */}
            <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
                    <Box>
                        <Typography variant="h5" fontWeight="bold">
                            Caso — {currentCase.caseType?.charAt(0).toUpperCase() + currentCase.caseType?.slice(1)}
                        </Typography>
                        <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                            Familia: <strong>{currentCase.family?.familyCode}</strong> — {currentCase.family?.headOfFamily}
                        </Typography>
                        <Typography color="text.secondary">
                            📍 {currentCase.family?.municipio}
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Chip
                            label={STATE_LABELS[currentCase.state]}
                            sx={{ backgroundColor: STATE_COLORS[currentCase.state], color: 'white', fontWeight: 'bold' }}
                        />
                        <Chip
                            label={`Prioridad: ${currentCase.priority}`}
                            color={currentCase.priority === 'alta' ? 'error' : currentCase.priority === 'media' ? 'warning' : 'success'}
                        />
                    </Box>
                </Box>

                {/* Acciones */}
                {!isClosed && (
                    <Box sx={{ mt: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        {nextStates.length > 0 && (
                            <Button variant="contained" sx={{ backgroundColor: '#0D4A2A' }}
                                onClick={() => setOpenTransition(true)}>
                                🔄 Cambiar Estado
                            </Button>
                        )}
                        <Button variant="outlined" onClick={() => setOpenIntervention(true)}>
                            + Registrar Intervención
                        </Button>
                    </Box>
                )}
            </Paper>

            {/* Flujo de estados (Stepper visual) */}
            <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>🗺️ Flujo del caso</Typography>
                <Stepper activeStep={
                    ['nuevo', 'en_diagnostico', 'en_intervencion', 'en_seguimiento', 'cerrado']
                        .indexOf(currentCase.state)
                } alternativeLabel>
                    {['nuevo', 'en_diagnostico', 'en_intervencion', 'en_seguimiento', 'cerrado'].map((s) => (
                        <Step key={s} completed={
                            ['nuevo', 'en_diagnostico', 'en_intervencion', 'en_seguimiento', 'cerrado']
                                .indexOf(s)
                            ['nuevo', 'en_diagnostico', 'en_intervencion', 'en_seguimiento', 'cerrado']
                                .indexOf(currentCase.state)
                        }>
                            <StepLabel>{STATE_LABELS[s]}</StepLabel>
                        </Step>
                    ))}
                </Stepper>

                {currentCase.state === 'suspendido' && (
                    <Alert severity="warning" sx={{ mt: 2 }}>
                        ⏸️ Caso suspendido — puede reactivarse a estado "nuevo"
                    </Alert>
                )}
            </Paper>

            {/* Timeline de intervenciones */}
            <Paper elevation={2} sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                    📋 Timeline de intervenciones ({interventions.length})
                </Typography>

                {interventions.length === 0 ? (
                    <Alert severity="info">Sin intervenciones registradas</Alert>
                ) : (
                    interventions.map((inv, idx) => (
                        <Box key={inv.id}>
                            <Box sx={{ display: 'flex', gap: 2, py: 2 }}>
                                <Box sx={{
                                    width: 40, height: 40, borderRadius: '50%', backgroundColor: '#E8F5EC',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    flexShrink: 0, fontSize: 18,
                                }}>
                                    {ACTION_LABELS[inv.actionType]?.split(' ')[0]}
                                </Box>
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="body2" fontWeight="bold">
                                        {ACTION_LABELS[inv.actionType] || inv.actionType}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                        {inv.description}
                                    </Typography>
                                    <Typography variant="caption" color="text.disabled" sx={{ mt: 0.5, display: 'block' }}>
                                        {new Date(inv.createdAt).toLocaleString('es-CO')}
                                    </Typography>
                                </Box>
                            </Box>
                            {idx < interventions.length - 1 && <Divider />}
                        </Box>
                    ))
                )}
            </Paper>

            {/* Dialog transición de estado */}
            <Dialog open={openTransition} onClose={() => setOpenTransition(false)} maxWidth="sm" fullWidth>
                <DialogTitle>🔄 Cambiar Estado del Caso</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                            Estado actual: <strong>{STATE_LABELS[currentCase.state]}</strong>
                        </Typography>

                        <FormControl fullWidth>
                            <InputLabel>Nuevo estado *</InputLabel>
                            <Select value={transitionData.newState} label="Nuevo estado *"
                                onChange={(e) => setTransitionData((p) => ({ ...p, newState: e.target.value }))}>
                                {nextStates.map((s) => (
                                    <MenuItem key={s} value={s}>{STATE_LABELS[s]}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <TextField label="Motivo del cambio *" multiline rows={3} fullWidth
                            value={transitionData.reason}
                            onChange={(e) => setTransitionData((p) => ({ ...p, reason: e.target.value }))}
                            placeholder="Describe el motivo de este cambio de estado..." />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenTransition(false)}>Cancelar</Button>
                    <Button onClick={handleTransition} variant="contained" sx={{ backgroundColor: '#0D4A2A' }}>
                        Confirmar Transición
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog registrar intervención */}
            <Dialog open={openIntervention} onClose={() => setOpenIntervention(false)} maxWidth="sm" fullWidth>
                <DialogTitle>+ Registrar Intervención</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                        <FormControl fullWidth>
                            <InputLabel>Tipo de acción *</InputLabel>
                            <Select value={interventionData.actionType} label="Tipo de acción *"
                                onChange={(e) => setInterventionData((p) => ({ ...p, actionType: e.target.value }))}>
                                {ACTION_TYPES.map((t) => (
                                    <MenuItem key={t} value={t}>{ACTION_LABELS[t]}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <TextField label="Descripción detallada *" multiline rows={4} fullWidth
                            value={interventionData.description}
                            onChange={(e) => setInterventionData((p) => ({ ...p, description: e.target.value }))}
                            placeholder="Describe la intervención realizada..." />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenIntervention(false)}>Cancelar</Button>
                    <Button onClick={handleAddIntervention} variant="contained" sx={{ backgroundColor: '#0D4A2A' }}>
                        Registrar
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};