// components/AdminPanel.jsx
import React from 'react';
import { RotateCcw } from 'lucide-react';

const AdminPanel = ({ 
  prizeStats, 
  families, 
  onGoHome, 
  onResetFamily, 
  onDeleteFamily 
}) => {
  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Admin Dashboard</h2>
          <div className="space-x-2">
            <button
              onClick={onGoHome}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Về trang chủ
            </button>
          </div>
        </div>

        {/* Prize Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-green-500/20 rounded-xl p-4 text-center border border-green-500/30">
            <div className="text-2xl font-bold text-green-300">
              {prizeStats.group1.current}/{prizeStats.group1.limit}
            </div>
            <div className="text-green-200 text-sm">Free Gift</div>
            <div className="text-xs text-green-400">
              {prizeStats.group1.limit - prizeStats.group1.current} còn lại
            </div>
          </div>
          <div className="bg-blue-500/20 rounded-xl p-4 text-center border border-blue-500/30">
            <div className="text-2xl font-bold text-blue-300">
              {prizeStats.group2.current}/{prizeStats.group2.limit}
            </div>
            <div className="text-blue-200 text-sm">1 Challenge</div>
            <div className="text-xs text-blue-400">
              {prizeStats.group2.limit - prizeStats.group2.current} còn lại
            </div>
          </div>
          <div className="bg-purple-500/20 rounded-xl p-4 text-center border border-purple-500/30">
            <div className="text-2xl font-bold text-purple-300">
              {prizeStats.group3.current}/{prizeStats.group3.limit}
            </div>
            <div className="text-purple-200 text-sm">2 Challenges</div>
            <div className="text-xs text-purple-400">
              {prizeStats.group3.limit - prizeStats.group3.current} còn lại
            </div>
          </div>
          <div className="bg-red-500/20 rounded-xl p-4 text-center border border-red-500/30">
            <div className="text-2xl font-bold text-red-300">
              {prizeStats.group4.current}/{prizeStats.group4.limit}
            </div>
            <div className="text-red-200 text-sm">3 Challenges</div>
            <div className="text-xs text-red-400">
              {prizeStats.group4.limit - prizeStats.group4.current} còn lại
            </div>
          </div>
        </div>

        {/* Families Table */}
        <div className="bg-white/5 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/10">
                <tr>
                  <th className="px-4 py-3 text-left text-white font-medium">
                    Họ và tên
                  </th>
                  <th className="px-4 py-3 text-left text-white font-medium">
                    ID Nhân viên
                  </th>
                  <th className="px-4 py-3 text-left text-white font-medium">
                    Kết quả
                  </th>
                  <th className="px-4 py-3 text-left text-white font-medium">
                    Thử thách
                  </th>
                  <th className="px-4 py-3 text-left text-white font-medium">
                    Thời gian
                  </th>
                  <th className="px-4 py-3 text-left text-white font-medium">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {families.map((family) => (
                  <tr key={family._id} className="hover:bg-white/5">
                    <td className="px-4 py-3 text-white">{family.name}</td>
                    <td className="px-4 py-3 text-white/80">
                      {family.employeeId || family.phone}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          family.spinResult === 'group_1'
                            ? 'bg-green-500/20 text-green-300'
                            : family.spinResult === 'group_2'
                            ? 'bg-blue-500/20 text-blue-300'
                            : family.spinResult === 'group_3'
                            ? 'bg-purple-500/20 text-purple-300'
                            : family.spinResult === 'group_4'
                            ? 'bg-red-500/20 text-red-300'
                            : 'bg-gray-500/20 text-gray-300'
                        }`}
                      >
                        {family.spinResult
                          ? family.spinResult === 'group_1'
                            ? 'Free Gift'
                            : family.spinResult === 'group_2'
                            ? '1 Challenge'
                            : family.spinResult === 'group_3'
                            ? '2 Challenges'
                            : '3 Challenges'
                          : 'Chưa quay'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-white">
                      {family.requiredChallenges || 0}
                    </td>
                    <td className="px-4 py-3 text-white/80 text-sm">
                      {new Date(family.checkInTime).toLocaleString('vi-VN')}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => onResetFamily(family._id)}
                          className="text-blue-400 hover:text-blue-300"
                          title="Reset"
                        >
                          <RotateCcw className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onDeleteFamily(family._id)}
                          className="text-red-400 hover:text-red-300"
                          title="Xóa"
                        >
                          ×
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;