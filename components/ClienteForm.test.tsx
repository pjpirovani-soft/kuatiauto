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
          id: '550e8400-e29b-41d4-a716-446655440000',
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
    expect(screen.getByLabelText(/telefono/i)).toHaveValue('+595981123456');
    expect(screen.getByLabelText(/notas/i)).toHaveValue('Cliente frecuente');
    expect(screen.getByRole('button', { name: /guardar/i })).toBeEnabled();
    expect(screen.getByRole('link', { name: /cancelar/i })).toHaveAttribute(
      'href',
      '/clientes',
    );
  });

  it('llama al action con el objeto plano correcto', async () => {
    const user = userEvent.setup();
    const action = vi.fn().mockResolvedValue({ ok: true, data: { id: 'nuevo-id' } });
    render(<ClienteForm action={action} title="Nuevo cliente" />);

    await user.type(screen.getByLabelText(/nombre/i), 'Juan');
    await user.type(screen.getByLabelText(/email/i), 'juan@example.com');
    await user.click(screen.getByRole('button', { name: /guardar/i }));

    await waitFor(() => {
      expect(action).toHaveBeenCalledTimes(1);
    });
    expect(action).toHaveBeenCalledWith({
      nombre: 'Juan',
      email: 'juan@example.com',
      telefono: null,
      notas: null,
    });
  });

  it('incluye id en el input cuando hay initialData', async () => {
    const user = userEvent.setup();
    const action = vi.fn().mockResolvedValue({ ok: true, data: { id: 'uuid-x' } });
    render(
      <ClienteForm
        action={action}
        title="Editar cliente"
        initialData={{
          id: '550e8400-e29b-41d4-a716-446655440000',
          nombre: 'Juan',
          email: null,
          telefono: null,
          notas: null,
        }}
      />,
    );

    await user.click(screen.getByRole('button', { name: /guardar/i }));

    await waitFor(() => {
      expect(action).toHaveBeenCalledTimes(1);
    });
    expect(action.mock.calls[0][0]).toHaveProperty('id', '550e8400-e29b-41d4-a716-446655440000');
  });

  it('muestra el error del action cuando devuelve ok:false', async () => {
    const user = userEvent.setup();
    const action = vi.fn().mockResolvedValue({ ok: false, error: 'Email ya registrado' });
    render(<ClienteForm action={action} title="Nuevo cliente" />);

    await user.type(screen.getByLabelText(/nombre/i), 'Juan');
    await user.click(screen.getByRole('button', { name: /guardar/i }));

    await waitFor(() => {
      expect(screen.getByText(/email ya registrado/i)).toBeInTheDocument();
    });
    expect(screen.getByRole('button', { name: /guardar/i })).toBeEnabled();
    expect(action).toHaveBeenCalledTimes(1);
  });

  it('muestra estado loading mientras el action esta pendiente', async () => {
    const user = userEvent.setup();
    let resolveAction: (v: { ok: true; data: { id: string } }) => void = () => {};
    const action = vi.fn().mockReturnValue(
      new Promise<{ ok: true; data: { id: string } }>((r) => {
        resolveAction = r;
      }),
    );
    render(<ClienteForm action={action} title="Nuevo cliente" />);

    await user.type(screen.getByLabelText(/nombre/i), 'Juan');
    await user.click(screen.getByRole('button', { name: /guardar/i }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /guardando/i })).toBeDisabled();
    });

    resolveAction({ ok: true, data: { id: 'nuevo-id' } });
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /guardar/i })).toBeEnabled();
    });
  });
});