import {
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    FormGroup,
    FormControlLabel,
    Checkbox,
    RadioGroup,
    Radio,
    Box,
    Typography,
} from '@mui/material';

export const SurveyForm = ({ fields, answers, onChange, showConditionalOnly = false }) => {
    const isAnswered = (fieldId, requiredValue) => {
        return answers[fieldId] === requiredValue;
    };

    const shouldShowField = (field) => {
        if (!field.conditionalOn) return true;
        return isAnswered(field.conditionalOn, field.conditionalValue);
    };

    return (
        <Box>
            {fields.map((field) => {
                if (!shouldShowField(field)) return null;

                return (
                    <Box key={field.id} sx={{ mb: 3 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                            {field.label}
                            {field.required && <span style={{ color: 'red' }}>*</span>}
                        </Typography>

                        {field.type === 'text' && (
                            <TextField
                                fullWidth
                                type="text"
                                value={answers[field.id] || ''}
                                onChange={(e) => onChange(field.id, e.target.value)}
                                placeholder={field.label}
                            />
                        )}

                        {field.type === 'textarea' && (
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                value={answers[field.id] || ''}
                                onChange={(e) => onChange(field.id, e.target.value)}
                                placeholder={field.label}
                            />
                        )}

                        {field.type === 'number' && (
                            <TextField
                                fullWidth
                                type="number"
                                value={answers[field.id] || ''}
                                onChange={(e) => onChange(field.id, e.target.value)}
                                placeholder={field.label}
                            />
                        )}

                        {field.type === 'date' && (
                            <TextField
                                fullWidth
                                type="date"
                                value={answers[field.id] || ''}
                                onChange={(e) => onChange(field.id, e.target.value)}
                                InputLabelProps={{ shrink: true }}
                            />
                        )}

                        {field.type === 'select' && (
                            <FormControl fullWidth>
                                <InputLabel>{field.label}</InputLabel>
                                <Select
                                    value={answers[field.id] || ''}
                                    onChange={(e) => onChange(field.id, e.target.value)}
                                    label={field.label}
                                >
                                    <MenuItem value="">
                                        <em>Seleccionar...</em>
                                    </MenuItem>
                                    {field.options?.map((opt) => (
                                        <MenuItem key={opt} value={opt}>
                                            {opt}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )}

                        {field.type === 'radio' && (
                            <RadioGroup
                                value={answers[field.id] || ''}
                                onChange={(e) => onChange(field.id, e.target.value)}
                            >
                                {field.options?.map((opt) => (
                                    <FormControlLabel key={opt} value={opt} control={<Radio />} label={opt} />
                                ))}
                            </RadioGroup>
                        )}

                        {field.type === 'checkbox' && (
                            <FormGroup>
                                {field.options?.map((opt) => (
                                    <FormControlLabel
                                        key={opt}
                                        control={
                                            <Checkbox
                                                checked={
                                                    Array.isArray(answers[field.id])
                                                        ? answers[field.id].includes(opt)
                                                        : false
                                                }
                                                onChange={(e) => {
                                                    const current = Array.isArray(answers[field.id])
                                                        ? answers[field.id]
                                                        : [];
                                                    const updated = e.target.checked
                                                        ? [...current, opt]
                                                        : current.filter((v) => v !== opt);
                                                    onChange(field.id, updated);
                                                }}
                                            />
                                        }
                                        label={opt}
                                    />
                                ))}
                            </FormGroup>
                        )}
                    </Box>
                );
            })}
        </Box>
    );
};