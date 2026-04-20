import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container, Box, Button, Alert, CircularProgress, Typography,
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, MenuItem, Select, InputLabel, FormControl,
} from '@mui/material';
import { useCasesStore } from '../store/casesStore';
import { useFamiliesStore } from '../store/familiesStore';

// Columnas del tablero Kanban
const STATES = [
    { key: 'nuevo', label: '🆕 Nuevo', color: '#E3F2FD', border: '#1565C0' },
    { key: 'en_diagnostico', label: '🔍 Diagnóstico', color: '#F3E5F5', border: '#6A1B9A' },
    { key: 'en_intervencion', label: '🛠️ Intervención', color: '#FFF3E0', border: '#E65100' },
    { key: 'en_seguimiento', label: '👁️ Seguimiento', color: '#E8F5E9', border: '#1B5E20' },
    { key: 'cerrado', label: '✅ Cerrado', color: '#EFEBE9', border: '#3E2723' },
    { key: 'suspendido', label: '⏸️ Suspendido', color: '#FAFAFA', border: '#757575' },
];

const PRIORITY_COLORS = {
    alta: { bg: '#FFEBEE', text: '#C62828', label: '🔴 Alta' },
    media: { bg: '#FFF3E0', text: '#E65100', label: '🟡 Media' },
    baja: { bg: '#E8F5E9', text: '#2E7D32', label: '🟢 Baja' },
};

const CASE_TYPES = ['tierra', 'vivienda', 'salud', 'educacion', 'ingresos', 'psicosocial'];

export const CasesPage = () => {
    const navigate = useNavigate();
    const { cases, isLoading, error, stats, fetchCases, fetchStats, createCase, clearError } = useCasesStore();
    const { families, fetchFamilies } = useFamiliesStore();

    const [openCreate, setOpenCreate] = useState(false);
    const [form, setForm] = useState({ familyId: '', caseType: 'tierra', priority: 'media', notes: '' });

    useEffect(() => {
        fetchCases({ take: 100 });
        fetchStats();
        fetchFamilies(0, 100);
    }, []);

    const casesByState = (state) => cases.filter((c) => c.state === state);

    const handleCreate = async () => {
        if (!form.familyId || !form.caseType) return;
        try {
            await createCase(form);
            setOpenCreate(false);
            setForm({ familyId: '', caseType: 'tierra', priority: 'media', notes: '' });
            fetchCases({ take: 100 });
        } catch { }
    };

    return (
        <Container maxWidth="xl" sx={{ mt: 3, mb: 4 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" fontWeight="bold">📌 Gestión de Casos</Typography>
                <Button variant="contained" sx={{ backgroundColor: '#0D4A2A' }} onClick={() => setOpenCreate(true)}>
                    + Nuevo Caso
                </Button>
            </Box>

            {error && <Alert severity="error" onClose={clearError} sx={{ mb: 2 }}>{error}</Alert>}

            {/* Stats rápidas */}
            {stats && (
                <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                    {stats.byState?.map((s) => (
                        <Box key={s.state} sx={{ backgroundColor: '#E8F5EC', borderRadius: 2, px: 2, py: 1 }}>
                            <Typography variant="body2" fontWeight="bold" color="#0D4A2A">
                                {s.state}: <strong>{s.count}</strong>
                            </Typography>
                        </Box>
                    ))}
                    {stats.inactiveCases > 0 && (
                        <Box sx={{ backgroundColor: '#FFEBEE', borderRadius: 2, px: 2, py: 1 }}>
                            <Typography variant="body2" fontWeight="bold" color="#C62828">
                                ⚠️ Inactivos &gt;30d: <strong>{stats.inactiveCases}</strong>
                            </Typography>
                        </Box>
                    )}
                </Box>
            )}

            {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                    <CircularProgress sx={{ color: '#0D4A2A' }} />
                </Box>
            ) : (
                // Tablero Kanban
                <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 2 }}>
                    {STATES.map((col) => (
                        <Box
                            key={col.key}
                            sx={{
                                minWidth: 220, flex: '0 0 220px',
                                backgroundColor: col.color,
                                borderRadius: 2, p: 2,
                                border: `2px solid ${col.border}`,
                            }}
                        >
                            <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1, color: col.border }}>
                                {col.label}
                                <Typography component="span" sx={{ ml: 1, fontSize: 13 }}>
                                    ({casesByState(col.key).length})
                                </Typography>
                            </Typography>

                            {casesByState(col.key).map((caso) => (
                                <Box
                                    key={caso.id}
                                    onClick={() => navigate(`/cases/${caso.id}`)}
                                    sx={{
                                        backgroundColor: 'white', borderRadius: 1.5, p: 1.5, mb: 1.5,
                                        cursor: 'pointer', boxShadow: 1,
                                        '&:hover': { boxShadow: 3, transform: 'translateY(-1px)' },
                                        transition: 'all 0.15s',
                                    }}
                                >
                                    <Typography variant="caption" color="text.secondary">
                                        {caso.family?.familyCode}
                                    </Typography>
                                    <Typography variant="body2" fontWeight="bold" sx={{ mt: 0.5 }}>
                                        {caso.caseType.charAt(0).toUpperCase() + caso.caseType.slice(1)}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {caso.family?.headOfFamily}
                                    </Typography>
                                    <Box sx={{
                                        mt: 1, px: 1, py: 0.5, borderRadius: 1,
                                        backgroundColor: PRIORITY_COLORS[caso.priority]?.bg,
                                        display: 'inline-block',
                                    }}>
                                        <Typography variant="caption" sx={{ color: PRIORITY_COLORS[caso.priority]?.text, fontWeight: 600 }}>
                                            {PRIORITY_COLORS[caso.priority]?.label}
                                        </Typography>
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    ))}
                </Box>
            )}

            {/* Dialog crear caso */}
            <Dialog open={openCreate} onClose={() => setOpenCreate(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Abrir Nuevo Caso</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                        <FormControl fullWidth>
                            <InputLabel>Familia *</InputLabel>
                            <Select value={form.familyId} label="Familia *"
                                onChange={(e) => setForm((p) => ({ ...p, familyId: e.target.value }))}>
                                {families.map((f) => (
                                    <MenuItem key={f.id} value={f.id}>
                                        {f.familyCode} — {f.headOfFamily}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth>
                            <InputLabel>Tipo de caso *</InputLabel>
                            <Select value={form.caseType} label="Tipo de caso *"
                                onChange={(e) => setForm((p) => ({ ...p, caseType: e.target.value }))}>
                                {CASE_TYPES.map((t) => (
                                    <MenuItem key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth>
                            <InputLabel>Prioridad *</InputLabel>
                            <Select value={form.priority} label="Prioridad *"
                                onChange={(e) => setForm((p) => ({ ...p, priority: e.target.value }))}>
                                <MenuItem value="alta">🔴 Alta</MenuItem>
                                <MenuItem value="media">🟡 Media</MenuItem>
                                <MenuItem value="baja">🟢 Baja</MenuItem>
                            </Select>
                        </FormControl>

                        <TextField label="Notas iniciales" multiline rows={3} fullWidth
                            value={form.notes}
                            onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))} />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenCreate(false)}>Cancelar</Button>
                    <Button onClick={handleCreate} variant="contained" sx={{ backgroundColor: '#0D4A2A' }}>
                        Abrir Caso
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};