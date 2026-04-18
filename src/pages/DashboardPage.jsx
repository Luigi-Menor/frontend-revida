import { useAuth } from '../hooks/useAuth';
import { Container, Paper, Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export const DashboardPage = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h3" component="h1" gutterBottom>
                    Bienvenido, {user?.firstName} {user?.lastName}
                </Typography>

                <Box sx={{ mt: 3, mb: 3 }}>
                    <Typography variant="body1">
                        <strong>Email:</strong> {user?.email}
                    </Typography>
                    <Typography variant="body1">
                        <strong>Rol:</strong> {user?.role}
                    </Typography>
                </Box>

                <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
                    📋 Próximas funcionalidades:
                </Typography>
                <ul>
                    <li>Gestión de familias</li>
                    <li>Aplicación de encuestas</li>
                    <li>Gestión de casos</li>
                    <li>Generación de reportes</li>
                </ul>

                <Button
                    variant="contained"
                    color="error"
                    onClick={handleLogout}
                    sx={{ mt: 4 }}
                >
                    Cerrar sesión
                </Button>
            </Paper>
        </Container>
    );
};