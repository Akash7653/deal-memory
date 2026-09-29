import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  Building2,
  Users,
  Briefcase,
  Search,
  RefreshCw,
  PlusCircle,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  Bot,
  Sparkles,
  FileText,
} from 'lucide-react';
import { fetchCompanyCustomers, createCompanyCustomer, fetchDeals, createDeal } from '../api';
import { useAuth } from '../context/AuthContext';

export default function Customers() {
  const { company, user } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Add Customer Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newIndustry, setNewIndustry] = useState('');
  const [newContact, setNewContact] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newCompanySize, setNewCompanySize] = useState('Enterprise');
  const [creating, setCreating] = useState(false);

  // Create Deal Modal
  const [isDealModalOpen, setIsDealModalOpen] = useState(false);
  const [dealCustomer, setDealCustomer] = useState(null);
  const [dealName, setDealName] = useState('');
  const [dealValue, setDealValue] = useState(180000);
  const [dealStage, setDealStage] = useState('Discovery');
  const [dealContact, setDealContact] = useState('');
  const [dealCompetitor, setDealCompetitor] = useState('Salesforce');
  const [dealCloseDate, setDealCloseDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 60);
    return d.toISOString().split('T')[0];
  });
  const [creatingDeal, setCreatingDeal] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [custData, dealsData] = await Promise.all([
        fetchCompanyCustomers().catch(() => []),
        fetchDeals(true).catch(() => ({ deals: [] })),
      ]);
      setCustomers(Array.isArray(custData) ? custData : (custData?.customers || []));
      setDeals(dealsData?.deals || []);
    } catch (e) {
      console.error('Failed to load customers and deals:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateCustomer = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;

    setCreating(true);
    try {
      const contactInfo = `${newContact.trim() || 'Key Contact'} (${newRole.trim() || 'Stakeholder'}, ${newEmail.trim() || 'contact@company.example'}) • ${newCompanySize}`;
      await createCompanyCustomer({
        name: newName.trim(),
        industry: newIndustry.trim() || 'Manufacturing',
        contact: newContact.trim(),
        role: newRole.trim(),
        email: newEmail.trim(),
        company_size: newCompanySize,
        contact_information: contactInfo,
      });

      setNewName('');
      setNewIndustry('');
      setNewContact('');
      setNewRole('');
      setNewEmail('');
      setNewCompanySize('Enterprise');
      setIsModalOpen(false);
      await loadData();
    } catch (e) {
      alert(e.message || 'Failed to create customer');
    } finally {
      setCreating(false);
    }
  };

  const handleOpenDealModal = (cust) => {
    setDealCustomer(cust);
    setDealName(`${cust.name} Digital Transformation`);
    setDealValue(180000);
    setDealStage('Discovery');
    // Extract contact person if present
    setDealContact(cust.contact_information || 'Key Decision Maker');
    setDealCompetitor('Salesforce');
    setIsDealModalOpen(true);
  };

  const handleCreateDealSubmit = async (e) => {
    e.preventDefault();
    if (!dealName.trim()) return;
    setCreatingDeal(true);
    try {
      await createDeal({
        company_name: dealName.trim(),
        customer_id: dealCustomer?.id,
        deal_value: parseInt(dealValue) || 100000,
        stage: dealStage,
        relationship_health: 0,
        primary_contact: dealContact,
        competitor: dealCompetitor,
        expected_close: dealCloseDate,
      });
      setIsDealModalOpen(false);
      await loadData();
    } catch (e) {
      alert(e.message || 'Failed to create deal');
    } finally {
      setCreatingDeal(false);
    }
  };

  const findCustomerDeal = (cust) => {
    if (!cust) return null;
    return deals.find((d) => {
      if (d.customer_id && d.customer_id === cust.id) return true;
      const dName = (d.company_name || '').toLowerCase();
      const cName = (cust.name || '').toLowerCase();
      return dName.includes(cName) || cName.includes(dName);
    });
  };

  const filtered = customers.filter((c) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return c.name?.toLowerCase().includes(q) || c.industry?.toLowerCase().includes(q) || c.contact_information?.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Customers
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
              {company?.name || user?.company || user?.company_name || 'Enterprise Workspace'}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enterprise accounts and decision-maker profiles managed within your isolated company workspace.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs cursor-pointer active:scale-95 transition-all"
          >
            <PlusCircle size={14} />
            <span>Add Customer</span>
          </button>
          <button
            onClick={loadData}
            className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            title="Refresh list"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative w-full sm:w-80">
        <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
        <input
          type="text"
          placeholder="Search customers or industries..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-purple-600 transition-all shadow-xs"
        />
      </div>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading && customers.length === 0 ? (
          <div className="col-span-full py-16 text-center">
            <RefreshCw className="w-7 h-7 text-purple-600 animate-spin mx-auto mb-2" />
            <p className="text-xs text-slate-500">Loading company customers...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <Building2 className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-60" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No customers found</p>
            <p className="text-xs text-slate-400 mt-1">Add your first customer account to begin building memory.</p>
          </div>
        ) : (
          filtered.map((c) => {
            const deal = findCustomerDeal(c);
            return (
              <div
                key={c.id}
                className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:border-purple-500/40 transition-colors"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400 font-extrabold text-sm">
                      {c.name.slice(0, 2).toUpperCase()}
                    </div>
                    {deal ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        ${(deal.deal_value || 0).toLocaleString()} ARR • {deal.stage}
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                        No Active Deal
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    {c.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {c.industry || 'Enterprise'}
                  </p>

                  <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 text-xs">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                      Stakeholders & Contacts
                    </span>
                    <p className="text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed">
                      {c.contact_information || (c.id === 'cust_acme' ? 'Sarah (VP Sales), David (CTO), Michael (CFO)' : 'Key Contact recorded')}
                    </p>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  {deal ? (
                    <div className="flex flex-wrap items-center gap-1.5">
                      <Link
                        to={`/deal?deal=${deal.id}`}
                        className="flex-1 text-center py-1.5 px-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-[11px] font-bold transition-all shadow-2xs"
                      >
                        Deal Overview
                      </Link>
                      <Link
                        to={`/meeting-prep?deal=${deal.id}`}
                        className="py-1.5 px-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 text-[11px] font-semibold transition-all"
                        title="Prepare Brief"
                      >
                        <Sparkles size={12} className="inline mr-1 text-purple-600 dark:text-purple-400" />
                        Prep
                      </Link>
                      <Link
                        to={`/agent?deal=${deal.id}`}
                        className="py-1.5 px-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 text-[11px] font-semibold transition-all"
                        title="Ask AI"
                      >
                        <Bot size={12} className="inline mr-1 text-purple-600 dark:text-purple-400" />
                        AI
                      </Link>
                      <Link
                        to={`/add-interaction?deal=${deal.id}&customer=${encodeURIComponent(c.name)}`}
                        className="py-1.5 px-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 text-[11px] font-semibold transition-all"
                        title="Add Notes"
                      >
                        <FileText size={12} className="inline" />
                      </Link>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleOpenDealModal(c)}
                      className="w-full inline-flex items-center justify-center gap-1 py-1.5 px-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                    >
                      <PlusCircle size={13} />
                      <span>Create Deal for {c.name}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 6.1 Add Customer Modal with Exact Fields */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <Building2 size={18} className="text-purple-600 dark:text-purple-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Add Customer Account
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCustomer} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Customer Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Globex Industries"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Industry *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Manufacturing"
                  value={newIndustry}
                  onChange={(e) => setNewIndustry(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Contact Person *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rohan Mehta"
                    value={newContact}
                    onChange={(e) => setNewContact(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Role *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CTO"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="e.g. rohan@globex.example"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Company Size
                </label>
                <select
                  value={newCompanySize}
                  onChange={(e) => setNewCompanySize(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-600"
                >
                  <option value="Enterprise">Enterprise (200+ employees)</option>
                  <option value="Mid-Market">Mid-Market (50-200 employees)</option>
                  <option value="Growth">Growth (11-50 employees)</option>
                  <option value="Startup">Startup (1-10 employees)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating || !newName.trim()}
                  className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  {creating ? 'Saving...' : 'Save Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6.2 Create Deal Modal */}
      {isDealModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <Briefcase size={18} className="text-purple-600 dark:text-purple-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Create Deal for {dealCustomer?.name}
                </h3>
              </div>
              <button
                onClick={() => setIsDealModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateDealSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Deal Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Globex Digital Transformation"
                  value={dealName}
                  onChange={(e) => setDealName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Deal Value ($ ARR) *
                  </label>
                  <input
                    type="number"
                    required
                    min="10000"
                    step="5000"
                    value={dealValue}
                    onChange={(e) => setDealValue(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Stage
                  </label>
                  <select
                    value={dealStage}
                    onChange={(e) => setDealStage(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-600"
                  >
                    <option value="Discovery">Discovery</option>
                    <option value="Evaluation">Evaluation</option>
                    <option value="Proposal">Proposal</option>
                    <option value="Negotiation">Negotiation</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Primary Contact *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rohan Mehta — CTO"
                  value={dealContact}
                  onChange={(e) => setDealContact(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Competitor
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Salesforce"
                    value={dealCompetitor}
                    onChange={(e) => setDealCompetitor(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Expected Close
                  </label>
                  <input
                    type="date"
                    value={dealCloseDate}
                    onChange={(e) => setDealCloseDate(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-600"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsDealModalOpen(false)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingDeal || !dealName.trim()}
                  className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  {creatingDeal ? 'Saving Deal...' : 'Save Deal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
