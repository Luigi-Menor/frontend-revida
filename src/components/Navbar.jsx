import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (['/login', '/register'].includes(location.pathname)) {
        return null;
    }

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography
                    variant="h6"
                    sx={{ flexGrow: 1, cursor: 'pointer', fontWeight: 'bold' }}
                    onClick={() => navigate('/dashboard')}
                >
                    🌿 ReViDa
                </Typography>

                {isAuthenticated && (
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button color="inherit" onClick={() => navigate('/dashboard')}>
                            Dashboard
                        </Button>
                        <Button color="inherit" onClick={() => navigate('/families')}>
                            Familias
                        </Button>
                        <Button color="inherit" onClick={() => navigate('/surveys/templates')}>
                            Encuestas
                        </Button>
                    </Box>
                )}

                {isAuthenticated ? (
                    <Box sx={{ ml: 3 }}>
                        <Typography variant="body2" sx={{ display: 'inline', mr: 2 }}>
                            {user?.firstName}
                        </Typography>
                        <Button color="inherit" onClick={handleLogout}>
                            Salir
                        </Button>
                    </Box>
                ) : (
                    <Box>
                        <Button color="inherit" onClick={() => navigate('/login')}>
                            Login
                        </Button>
                        <Button color="inherit" onClick={() => navigate('/register')}>
                            Registrarse
                        </Button>
                    </Box>
                )}
            </Toolbar>
        </AppBar>
    );
};