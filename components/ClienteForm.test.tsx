import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ClienteForm } from './ClienteForm';

describe('ClienteForm', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renderiza campos, titulo y boton con initialData', () => {
    const action = vi.fn();
    render(
      <ClienteForm
        action={action}
        title="Editar cliente"
        initialData={{
          nombre: 'Juan Perez',
          email: 'juan@example.com',
          telefono: '+595981123456',
          notas: 'Cliente frecuente',
        }}
      />,
    );

    expect(screen.getByRole('heading', { name: /editar cliente/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/nombre/i)).toHaveValue('Juan Perez');
    expect(screen.getByLabelText(/email/i)).toHaveValue('juan@example.com');
    expect(screen.getByLabelText(/teléfono/i)).toHaveValue('+595981123456');
    expect(screen.getByLabelText(/notas/i)).toHaveValue('Cliente frecuente');
    expect(screen.getByRole('button', { name: /guardar/i })).toBeEnabled();
    expect(screen.getByRole('link', { name: /cancelar/i })).toHaveAttribute(
      'href',
      '/dashboard/clientes',
    );
  });

  it('muestra el error del action y vuelve a estado idle', async () => {
    const user = userEvent.setup();
    const action = vi.fn().mockResolvedValue({ error: 'Email ya registrado' });
    render(<ClienteForm action={action} title="Nuevo cliente" />);

    await user.type(screen.getByLabelText(/nombre/i), 'Juan');
    await user.type(screen.getByLabelText(/email/i), 'juan@example.com');
    await user.click(screen.getByRole('button', { name: /guardar/i }));

    await waitFor(() => {
      expect(screen.getByText(/email ya registrado/i)).toBeInTheDocument();
    });
    expect(screen.getByRole('button', { name: /guardar/i })).toBeEnabled();
    expect(action).toHaveBeenCalledTimes(1);
  });

  it('muestra estado loading mientras el action esta pendiente', async () => {
    const user = userEvent.setup();
    let resolveAction: (v: { error?: string } | void) => void = () => {};
    const action = vi.fn().mockReturnValue(
      new Promise<{ error?: string } | void>((r) => {
        resolveAction = r;
      }),
    );
    render(<ClienteForm action={action} title="Nuevo cliente" />);

    await user.type(screen.getByLabelText(/nombre/i), 'Juan');
    await user.type(screen.getByLabelText(/email/i), 'juan@example.com');
    await user.click(screen.getByRole('button', { name: /guardar/i }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /guardando/i })).toBeDisabled();
    });

    resolveAction(undefined);
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /guardar/i })).toBeEnabled();
    });
  });
});
