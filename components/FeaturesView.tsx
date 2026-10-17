'use client';

import React, { useState } from 'react';
import { FeaturePerson } from '../lib/types';
import { ButtonConfirmModal, TypedConfirmModal } from './ConfirmModal';
import { CustomDropdown } from './CustomDropdown';

interface FeaturesViewProps {
  features: FeaturePerson[];
  onAdd: (person: FeaturePerson) => void;
  onUpdate: (person: FeaturePerson) => void;
  onDelete: (id: string) => void;
}

export function FeaturesView({
  features,
  onAdd,
  onUpdate,
  onDelete,
}: FeaturesViewProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingPerson, setEditingPerson] = useState<FeaturePerson | null>(null);

  // Modals
  const [confirmEditPerson, setConfirmEditPerson] = useState<FeaturePerson | null>(null);
  const [confirmDeletePerson, setConfirmDeletePerson] = useState<FeaturePerson | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [role, setRole] = useState('Artist');
  const [email, setEmail] = useState('');
  const [socialsInput, setSocialsInput] = useState('');
  const [projectsInput, setProjectsInput] = useState('');
  const [notes, setNotes] = useState('');

  const handleStartAdd = () => {
    setIsAdding(true);
    setEditingPerson(null);
    setName('');
    setRole('Artist');
    setEmail('');
    setSocialsInput('');
    setProjectsInput('');
    setNotes('');
  };

  const handleStartEdit = (person: FeaturePerson) => {
    setConfirmEditPerson(person);
  };

  const handleConfirmEdit = () => {
    if (!confirmEditPerson) return;
    const p = confirmEditPerson;
    setEditingPerson(p);
    setName(p.name);
    setRole(p.role);
    setEmail(p.email || '');
    setSocialsInput((p.socialLinks || []).join('\n'));
    setProjectsInput((p.projectsWorkedOn || []).join('\n'));
    setNotes(p.notes || '');
    setIsAdding(false);
    setConfirmEditPerson(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const socialLinks = socialsInput
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const projectsWorkedOn = projectsInput
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    if (editingPerson) {
      const updated: FeaturePerson = {
        ...editingPerson,
        name: name.trim(),
        role: role.trim(),
        email: email.trim(),
        socialLinks,
        projectsWorkedOn,
        notes: notes.trim(),
      };
      onUpdate(updated);
      setEditingPerson(null);
    } else {
      const newPerson: FeaturePerson = {
        id: 'feat_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
        name: name.trim(),
        role: role.trim(),
        email: email.trim(),
        socialLinks,
        projectsWorkedOn,
        notes: notes.trim(),
        createdAt: new Date().toISOString(),
      };
      onAdd(newPerson);
      setIsAdding(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto p-3 text-xs space-y-4">
      {/* Top Controls */}
      <div className="flex items-center justify-between pb-1.5 border-b border-[#111]">
        <span className="font-semibold text-[#111]">Features</span>
        {!isAdding && !editingPerson && (
          <button
            type="button"
            onClick={handleStartAdd}
            className="px-2 py-0.5 border border-[#111] bg-white rounded-[3px] text-[11px] text-[#111] hover:bg-[#f2f2f2] cursor-pointer"
          >
            + Add
          </button>
        )}
      </div>

      {/* Form for add or edit */}
      {(isAdding || editingPerson) && (
        <form onSubmit={handleSubmit} className="p-2 border border-[#111] rounded-[3px] space-y-2 bg-[#fafafa]">
          <div className="flex justify-between items-center text-[11px] font-medium text-[#111]">
            <span>{editingPerson ? 'Edit person' : 'New person'}</span>
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setEditingPerson(null);
              }}
              className="text-[#666] hover:text-[#000] underline cursor-pointer"
            >
              Cancel
            </button>
          </div>

          <div>
            <label className="block text-[10px] text-[#555] mb-0.5">Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-[#888] p-1 bg-white text-[#111] text-xs rounded-[2px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] text-[#555] mb-0.5">Role</label>
              <CustomDropdown
                value={role}
                options={[
                  'Artist',
                  'Producer',
                  'Music video director',
                  'Audio engineer',
                  'Mixing engineer',
                  'Mastering engineer',
                  'Songwriter',
                  'Creative director',
                ]}
                onChange={(val) => setRole(val)}
                allowCustom
              />
            </div>
            <div>
              <label className="block text-[10px] text-[#555] mb-0.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-[#888] p-1 bg-white text-[#111] text-xs rounded-[2px]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] text-[#555] mb-0.5">
              Social links (one per line)
            </label>
            <textarea
              rows={2}
              value={socialsInput}
              onChange={(e) => setSocialsInput(e.target.value)}
              className="w-full border border-[#888] p-1 bg-white text-[#111] text-xs rounded-[2px]"
            />
          </div>

          <div>
            <label className="block text-[10px] text-[#555] mb-0.5">
              Projects worked on / working on (one per line)
            </label>
            <textarea
              rows={2}
              value={projectsInput}
              onChange={(e) => setProjectsInput(e.target.value)}
              className="w-full border border-[#888] p-1 bg-white text-[#111] text-xs rounded-[2px]"
            />
          </div>

          <div>
            <label className="block text-[10px] text-[#555] mb-0.5">Notes</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full border border-[#888] p-1 bg-white text-[#111] text-xs rounded-[2px]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-1 bg-[#111] text-white border border-[#111] rounded-[3px] text-xs hover:bg-[#333] cursor-pointer"
          >
            Save person
          </button>
        </form>
      )}

      {/* People list */}
      {!isAdding && !editingPerson && features.length === 0 && (
        <div className="py-8 text-center text-[#777] text-xs">No features recorded yet</div>
      )}

      {!isAdding && !editingPerson && features.length > 0 && (
        <div className="divide-y divide-[#eee]">
          {features.map((person) => (
            <div key={person.id} className="py-2.5 space-y-1">
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-semibold text-xs text-[#111]">{person.name}</span>
                  <span className="text-[11px] text-[#666] ml-1.5">({person.role})</span>
                  {person.email && (
                    <div className="text-[11px] text-[#444] mt-0.5">&lt;{person.email}&gt;</div>
                  )}
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleStartEdit(person)}
                    className="text-[10px] text-[#555] hover:text-[#000] underline cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDeletePerson(person)}
                    className="text-[10px] text-[#888] hover:text-[#000] underline cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {person.projectsWorkedOn && person.projectsWorkedOn.length > 0 && (
                <div className="text-[11px] text-[#444] pl-2 border-l border-[#888]">
                  <span className="font-medium text-[#111]">Projects: </span>
                  {person.projectsWorkedOn.join(', ')}
                </div>
              )}

              {person.socialLinks && person.socialLinks.length > 0 && (
                <div className="text-[10px] text-[#666] flex flex-wrap gap-2">
                  {person.socialLinks.map((link, idx) => (
                    <a
                      key={idx}
                      href={link.startsWith('http') ? link : `https://${link}`}
                      target="_blank"
                      rel="noreferrer"
                      className="underline hover:text-[#111]"
                    >
                      {link.replace(/^https?:\/\/(www\.)?/, '')}
                    </a>
                  ))}
                </div>
              )}

              {person.notes && (
                <div className="text-[11px] text-[#555] italic">{person.notes}</div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Button Confirmation for Editing Person (Yes on left, No on right) */}
      <ButtonConfirmModal
        isOpen={!!confirmEditPerson}
        title={`Edit ${confirmEditPerson?.name}?`}
        onConfirm={handleConfirmEdit}
        onCancel={() => setConfirmEditPerson(null)}
      />

      {/* Typed Confirmation for Deleting Person */}
      <TypedConfirmModal
        isOpen={!!confirmDeletePerson}
        title={confirmDeletePerson ? `Delete ${confirmDeletePerson.name}` : ''}
        expectedText="Delete"
        onConfirm={() => {
          if (confirmDeletePerson) {
            onDelete(confirmDeletePerson.id);
            setConfirmDeletePerson(null);
          }
        }}
        onCancel={() => setConfirmDeletePerson(null)}
      />
    </div>
  );
}
