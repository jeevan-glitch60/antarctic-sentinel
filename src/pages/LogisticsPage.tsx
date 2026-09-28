import React, { useState } from 'react';
import { useStation } from '../context/StationContext';
import { InventoryItem } from '../types';
import { 
  Package, 
  Search, 
  Filter, 
  Plus, 
  Minus, 
  Ship, 
  Calendar, 
  AlertTriangle, 
  CheckCircle2, 
  RotateCcw 
} from 'lucide-react';

export const LogisticsPage: React.FC = () => {
  const { inventory, useInventoryItem, reorderInventoryItem, stationData } = useStation();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.partNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const categories = ['all', 'Mechanical Spares', 'Electrical', 'Fuel & Fluid', 'Thermal', 'Medical', 'Rations'];

  return (
    <div className="space-y-3.5 max-w-[1600px] mx-auto select-none">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[var(--border)] pb-3">
        <div>
          <h1 className="text-[20px] font-semibold text-[var(--text-primary)]">
            Logistics, Inventory & Expedition Resupply
          </h1>
          <p className="text-[13px] text-[var(--text-secondary)] mt-0.5">
            Depot stock visibility, cold-rated spares tracking, and annual ISEA supply ship voyage schedules.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="font-mono text-[11px] px-2.5 py-1 rounded bg-[var(--surface-subtle)] border border-[var(--border)] text-[var(--text-muted)]">
            Warehouse Node: {stationData.code}-DEPOT-01
          </div>
        </div>
      </div>

      {/* CONSUMABLES SUMMARY STRIP (5 cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="card-polar p-3 border-l-[3px] border-l-[var(--success)]">
          <div className="text-[11px] font-mono uppercase text-[var(--text-muted)]">Food Supplies</div>
          <div className="text-[16px] font-mono font-semibold text-[var(--text-primary)] mt-0.5">68 t</div>
          <div className="text-[11px] font-mono text-[var(--success)]">12 days (reserve OK)</div>
        </div>

        <div className="card-polar p-3 border-l-[3px] border-l-[var(--caution)]">
          <div className="text-[11px] font-mono uppercase text-[var(--text-muted)]">Fuel (Diesel)</div>
          <div className="text-[16px] font-mono font-semibold text-[var(--text-primary)] mt-0.5">62% (12.4k L)</div>
          <div className="text-[11px] font-mono text-[var(--caution)]">8 days (storm load)</div>
        </div>

        <div className="card-polar p-3 border-l-[3px] border-l-[var(--caution)]">
          <div className="text-[11px] font-mono uppercase text-[var(--text-muted)]">Spare Parts</div>
          <div className="text-[16px] font-mono font-semibold text-[var(--text-primary)] mt-0.5">54% Ratio</div>
          <div className="text-[11px] font-mono text-[var(--caution)]">16 days safe margin</div>
        </div>

        <div className="card-polar p-3 border-l-[3px] border-l-[var(--success)]">
          <div className="text-[11px] font-mono uppercase text-[var(--text-muted)]">Medical Supplies</div>
          <div className="text-[16px] font-mono font-semibold text-[var(--text-primary)] mt-0.5">84% Stock</div>
          <div className="text-[11px] font-mono text-[var(--success)]">20 days target OK</div>
        </div>

        <div className="card-polar p-3 border-l-[3px] border-l-[var(--success)] col-span-2 sm:col-span-1">
          <div className="text-[11px] font-mono uppercase text-[var(--text-muted)]">General Supplies</div>
          <div className="text-[16px] font-mono font-semibold text-[var(--text-primary)] mt-0.5">73% Full</div>
          <div className="text-[11px] font-mono text-[var(--success)]">15 days buffer</div>
        </div>
      </div>

      {/* INVENTORY CATALOG TABLE & CONTROLS */}
      <div className="card-polar p-4 space-y-3">
        {/* Search & Filter Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] pb-3">
          <div className="flex items-center gap-2 flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-[var(--text-muted)]" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search part number, sensor model, or fuel type..."
                className="w-full pl-8 pr-3 py-1.5 bg-[var(--surface-subtle)] border border-[var(--border)] rounded text-[12px] focus:outline-none focus:border-[var(--accent)]"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-[var(--text-muted)] uppercase">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-[var(--surface)] border border-[var(--border)] rounded px-2.5 py-1 text-[12px] text-[var(--text-secondary)] focus:outline-none focus:border-[var(--accent)]"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat === 'all' ? 'All Inventory' : cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Dense Research Inventory Table */}
        <div className="overflow-x-auto">
          <table className="w-full table-polar select-none text-[12px]">
            <thead>
              <tr>
                <th>Part Number</th>
                <th>Item Description</th>
                <th>Category</th>
                <th>Stock Level</th>
                <th>Threshold</th>
                <th>Location</th>
                <th>Condition</th>
                <th className="text-right">Dispatch Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredInventory.map(item => {
                const isCritical = item.currentStock <= item.minThreshold;
                return (
                  <tr key={item.id}>
                    <td className="font-mono text-[11px] font-semibold text-[var(--text-primary)]">
                      {item.partNumber}
                    </td>
                    <td className="font-medium text-[var(--text-primary)]">
                      {item.name}
                    </td>
                    <td className="font-mono text-[11px] text-[var(--text-muted)]">
                      {item.category}
                    </td>
                    <td className="font-mono">
                      <span className={isCritical ? 'text-[var(--critical)] font-bold' : 'text-[var(--text-primary)]'}>
                        {item.currentStock.toLocaleString()} {item.unit}
                      </span>
                    </td>
                    <td className="font-mono text-[var(--text-muted)]">
                      {item.minThreshold} {item.unit}
                    </td>
                    <td className="font-mono text-[11px] text-[var(--text-secondary)]">
                      {item.binLocation}
                    </td>
                    <td>
                      <span className={`text-[11px] font-mono px-1.5 py-0.2 rounded border ${
                        item.condition === 'Critical'
                          ? 'border-[var(--critical)] text-[var(--critical)] bg-[var(--critical-soft)]'
                          : item.condition === 'Limited Stock'
                            ? 'border-[var(--warning)] text-[var(--warning)] bg-[var(--warning-soft)]'
                            : 'border-[var(--border)] text-[var(--text-secondary)]'
                      }`}>
                        {item.condition}
                      </span>
                    </td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => useInventoryItem(item.id, 1)}
                          disabled={item.currentStock <= 0}
                          title="Issue 1 unit to maintenance"
                          className="px-2 py-0.5 rounded border border-[var(--border)] hover:bg-[var(--surface-subtle)] text-[11px] font-mono text-[var(--text-secondary)] disabled:opacity-30"
                        >
                          - Issue
                        </button>
                        <button
                          onClick={() => reorderInventoryItem(item.id, 2)}
                          title="Restock 2 units"
                          className="px-2 py-0.5 rounded border border-[var(--border)] hover:bg-[var(--surface-subtle)] text-[11px] font-mono text-[var(--accent)]"
                        >
                          + Restock
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ANNUAL EXPEDITION VOYAGE (ISEA) MILESTONES */}
      <div className="card-polar p-4 space-y-3">
        <div className="flex justify-between items-center border-b border-[var(--border)] pb-2">
          <div className="flex items-center gap-2">
            <Ship className="w-4 h-4 text-[var(--accent)]" />
            <h3 className="text-[14px] font-semibold text-[var(--text-primary)]">
              Annual Indian Antarctic Expedition (ISEA-45) Cargo Vessel Tracking
            </h3>
          </div>
          <span className="font-mono text-[11px] text-[var(--text-muted)]">
            Vessel: MV Vasiliy Golovnin (Chartered Ice-Class Vessel)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-1 text-[12px]">
          <div className="p-2.5 bg-[var(--surface-subtle)] border border-[var(--border)] rounded">
            <div className="font-mono text-[10px] text-[var(--text-muted)] uppercase">Nov 15, 2026</div>
            <div className="font-semibold text-[var(--text-primary)] mt-0.5">Cape Town Departure</div>
            <div className="text-[11px] text-[var(--text-secondary)] mt-0.5">Loading 480 t polar fuel and dry rations.</div>
          </div>

          <div className="p-2.5 bg-[var(--surface-subtle)] border border-[var(--border)] rounded">
            <div className="font-mono text-[10px] text-[var(--text-muted)] uppercase">Nov 28, 2026</div>
            <div className="font-semibold text-[var(--text-primary)] mt-0.5">Roaring Forties Transit</div>
            <div className="text-[11px] text-[var(--text-secondary)] mt-0.5">Entering southern polar convergent ice pack.</div>
          </div>

          <div className="p-2.5 bg-[var(--surface-subtle)] border border-[var(--border)] rounded">
            <div className="font-mono text-[10px] text-[var(--text-muted)] uppercase">Dec 14, 2026</div>
            <div className="font-semibold text-[var(--text-primary)] mt-0.5">Bharati Fast-Ice Mooring</div>
            <div className="text-[11px] text-[var(--text-secondary)] mt-0.5">Helicopter sling operation to Larsemann Hills.</div>
          </div>

          <div className="p-2.5 bg-[var(--surface-subtle)] border border-[var(--border)] rounded">
            <div className="font-mono text-[10px] text-[var(--text-muted)] uppercase">Jan 06, 2027</div>
            <div className="font-semibold text-[var(--text-primary)] mt-0.5">Maitri Convoy Resupply</div>
            <div className="text-[11px] text-[var(--text-secondary)] mt-0.5">Overland PistenBully traverse over blue ice.</div>
          </div>

          <div className="p-2.5 bg-[var(--surface-subtle)] border border-[var(--border)] rounded">
            <div className="font-mono text-[10px] text-[var(--text-muted)] uppercase">Mar 10, 2027</div>
            <div className="font-semibold text-[var(--text-primary)] mt-0.5">Austral Season Evacuation</div>
            <div className="text-[11px] text-[var(--text-secondary)] mt-0.5">Summer science crew exit before freeze-up.</div>
          </div>
        </div>
      </div>
    </div>
  );
};
