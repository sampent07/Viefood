"use client";

import React, { useState, useEffect } from "react";
import { PhoneCall, Check, MessageSquare, Clock, AlertCircle } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function AdminConsultationsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState("");

  const fetchConsultations = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/consultations?status=${statusFilter}`);
      const data = await res.json();
      if (data.success) {
        setRequests(data.requests);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsultations();
  }, [statusFilter]);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch("/api/admin/consultations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setRequests((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveNote = async (id: string) => {
    try {
      const res = await fetch("/api/admin/consultations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, staffNote: noteText }),
      });
      const data = await res.json();
      if (data.success) {
        setRequests((prev) =>
          prev.map((r) => (r.id === id ? { ...r, staffNote: noteText } : r))
        );
        setEditingNoteId(null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const statusMap: Record<string, { label: string; color: string }> = {
    NEW: { label: "Mới (NEW)", color: "text-amber-800 bg-amber-50" },
    CONTACTING: { label: "Đang liên hệ", color: "text-blue-800 bg-blue-50" },
    CONSULTED: { label: "Đã tư vấn", color: "text-indigo-800 bg-indigo-50" },
    CONVERTED: { label: "Đã chốt gói (Thành công)", color: "text-emerald-800 bg-emerald-50" },
    CANCELLED: { label: "Đã hủy", color: "text-red-800 bg-red-50" },
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-brand-600 uppercase tracking-wider block">
            Khách hàng tiềm năng
          </span>
          <h1 className="text-2xl font-black text-gray-900 mt-0.5">
            Quản Lý Yêu Cầu Tư Vấn Gói Tháng
          </h1>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="text-xs py-2 px-3 bg-white border border-gray-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          <option value="ALL">Tất cả trạng thái</option>
          <option value="NEW">Mới (NEW)</option>
          <option value="CONTACTING">Đang liên hệ (CONTACTING)</option>
          <option value="CONSULTED">Đã tư vấn (CONSULTED)</option>
          <option value="CONVERTED">Đã chốt gói (CONVERTED)</option>
          <option value="CANCELLED">Đã hủy (CANCELLED)</option>
        </select>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="text-center py-12 text-xs text-gray-400">Đang tải danh sách...</div>
        ) : requests.length === 0 ? (
          <div className="text-center py-12 text-xs text-gray-400">
            Chưa có yêu cầu tư vấn nào.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-100">
                <tr>
                  <th className="py-3 px-4">Mã yêu cầu</th>
                  <th className="py-3 px-4">Khách hàng & Liên hệ</th>
                  <th className="py-3 px-4">Mục tiêu & Dị ứng</th>
                  <th className="py-3 px-4">Chi nhánh</th>
                  <th className="py-3 px-4">Trạng thái xử lý</th>
                  <th className="py-3 px-4">Ghi chú nội bộ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {requests.map((req) => (
                  <tr key={req.id} className="hover:bg-gray-50/60 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-gray-900 align-top">
                      {req.requestCode}
                      <span className="block text-[10px] text-gray-400 font-normal">
                        {formatDate(req.createdAt)}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 align-top">
                      <span className="font-bold text-gray-900 block">{req.fullName}</span>
                      <span className="text-brand-700 block">SĐT: {req.phone}</span>
                      {req.zalo && req.zalo !== req.phone && (
                        <span className="text-gray-500 block">Zalo: {req.zalo}</span>
                      )}
                      <span className="text-gray-400 text-[10px] block mt-0.5">
                        Giờ liên hệ: {req.preferredContactTime || "Bất kỳ lúc nào"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 align-top max-w-xs">
                      <p className="font-semibold text-gray-800">{req.dietaryGoals || "Chưa chọn"}</p>
                      {req.notes && (
                        <p className="text-[11px] text-amber-700 italic mt-0.5">
                          Lưu ý: {req.notes}
                        </p>
                      )}
                      {req.deliveryArea && (
                        <p className="text-[10px] text-gray-400 mt-0.5">Khu vực: {req.deliveryArea}</p>
                      )}
                    </td>
                    <td className="py-3.5 px-4 align-top font-medium text-gray-600">
                      {req.branch?.name || "Toàn hệ thống"}
                    </td>
                    <td className="py-3.5 px-4 align-top">
                      <select
                        value={req.status}
                        onChange={(e) => handleUpdateStatus(req.id, e.target.value)}
                        className="text-xs font-semibold py-1.5 px-2 rounded-lg border border-gray-200 bg-white"
                      >
                        <option value="NEW">Mới (NEW)</option>
                        <option value="CONTACTING">Đang liên hệ</option>
                        <option value="CONSULTED">Đã tư vấn</option>
                        <option value="CONVERTED">Đã chốt gói</option>
                        <option value="CANCELLED">Hủy bỏ</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4 align-top max-w-xs">
                      {editingNoteId === req.id ? (
                        <div className="space-y-1">
                          <textarea
                            rows={2}
                            value={noteText}
                            onChange={(e) => setNoteText(e.target.value)}
                            className="w-full text-xs p-1.5 border border-gray-200 rounded"
                          />
                          <div className="flex space-x-1 justify-end">
                            <button
                              onClick={() => setEditingNoteId(null)}
                              className="px-2 py-0.5 text-gray-500"
                            >
                              Hủy
                            </button>
                            <button
                              onClick={() => handleSaveNote(req.id)}
                              className="px-2 py-0.5 bg-brand-600 text-white rounded font-bold"
                            >
                              Lưu
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div
                          onClick={() => {
                            setEditingNoteId(req.id);
                            setNoteText(req.staffNote || "");
                          }}
                          className="cursor-pointer hover:bg-gray-100 p-1 rounded text-gray-600 min-h-[24px]"
                          title="Bấm để sửa ghi chú"
                        >
                          {req.staffNote ? req.staffNote : <span className="text-gray-400 italic">+ Thêm ghi chú</span>}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

