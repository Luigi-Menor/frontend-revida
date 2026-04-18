import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
    it('debe renderizar sin errores', () => {
        render(<App />);
        // Verifica que se renderice algo
        expect(screen.getByText(/ReViDa/i)).toBeDefined();
    });
});