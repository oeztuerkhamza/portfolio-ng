/** Formularfelder als Objekt; leere Felder werden zu null (bzw. false bei Checkboxen). */
export function formData(form: HTMLFormElement, fields: string[]): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const name of fields) {
    const el = form.elements.namedItem(name) as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null;
    if (!el) continue;
    if (el instanceof HTMLInputElement && el.type === 'checkbox') out[name] = el.checked;
    else if (el instanceof HTMLInputElement && el.type === 'number') out[name] = el.value === '' ? null : Number(el.value);
    else out[name] = el.value.trim() === '' ? null : el.value.trim();
  }
  return out;
}
