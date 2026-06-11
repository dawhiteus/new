import React, { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { 
  Plus, 
  Mail, 
  Phone, 
  Building2, 
  UserCircle,
  Edit2,
  Trash2,
  Bot,
} from 'lucide-react';
import { AddTeamMemberModal } from './AddTeamMemberModal';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  organization: string;
  email: string;
  phone?: string;
  type: 'Internal' | 'External' | 'Agent';
  description?: string;
}

interface DealTeamSectionProps {
  dealId: string;
}

export const sampleTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Matthew Weiner',
    role: 'Lead Broker',
    organization: 'LiquidSpace',
    email: 'matthew.weiner@liquidspace.com',
    phone: '(415) 555-0123',
    type: 'Internal',
  },
  {
    id: '2',
    name: 'Sarah Chen',
    role: 'Client Contact',
    organization: 'Tel Tech',
    email: 'sarah.chen@teltech.com',
    phone: '(212) 555-0456',
    type: 'External',
  },
  {
    id: '3',
    name: 'David Kim',
    role: 'Legal Counsel',
    organization: 'LiquidSpace',
    email: 'david.kim@liquidspace.com',
    type: 'Internal',
  },
  {
    id: '4',
    name: 'Jennifer Martinez',
    role: 'Deal Coordinator',
    organization: 'LiquidSpace',
    email: 'jennifer.martinez@liquidspace.com',
    phone: '(415) 555-0789',
    type: 'Internal',
  },
  {
    id: '5',
    name: 'Requirements Intake Agent',
    role: 'Structure requirement',
    organization: 'LiquidSpace AI',
    email: 'requirements.agent@ai.liquidspace.com',
    type: 'Agent',
    description: 'Convert natural language descriptions, uploaded briefs, or reference spaces into structured requirement drafts.',
  },
  {
    id: '6',
    name: 'Market Sourcing Agent',
    role: 'Build collection',
    organization: 'LiquidSpace AI',
    email: 'sourcing.agent@ai.liquidspace.com',
    type: 'Agent',
    description: 'Searches the LiquidSpace marketplace and builds a comprehensive first-pass candidate set — not a curated shortlist. Its purpose is to give the Collection Assessment Agent and human reviewers a full option set to work from. After this task completes, the Collection Assessment Agent runs automatically and the Collection tab becomes visible on the requirement.',
  },
  {
    id: '10',
    name: 'Collection Assessment Agent',
    role: 'Assess collection',
    organization: 'LiquidSpace AI',
    email: 'assessment.agent@ai.liquidspace.com',
    type: 'Agent',
    description: 'A Requirement-aware lens layered on top of LiquidSpace\'s existing recommendations. Answers: how well does this specific collection satisfy this specific requirement? Evaluates each space across five dimensions — location proximity, workspace type, size and capacity, budget, and term. Runs automatically after sourcing completes, and re-triggers when requirement fields are edited.',
  },
];

export function DealTeamSection({ dealId }: DealTeamSectionProps) {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(sampleTeamMembers);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filterRole, setFilterRole] = useState('all');
  const [filterType, setFilterType] = useState('all');

  const filteredMembers = teamMembers.filter(member => {
    const matchesRole = filterRole === 'all' || member.role === filterRole;
    const matchesType = filterType === 'all' || member.type === filterType;
    return matchesRole && matchesType;
  });

  const getTypeBadge = (type: 'Internal' | 'External' | 'Agent') => {
    if (type === 'Internal') {
      return (
        <Badge 
          style={{ backgroundColor: '#005B94', color: 'white', fontSize: '11px', fontWeight: 500 }}
          className="px-2 py-1 rounded-full"
        >
          Internal
        </Badge>
      );
    } else if (type === 'External') {
      return (
        <Badge 
          className="bg-purple-600 text-white px-2 py-1 rounded-full"
          style={{ fontSize: '11px', fontWeight: 500 }}
        >
          External
        </Badge>
      );
    } else {
      return (
        <Badge 
          className="bg-green-600 text-white px-2 py-1 rounded-full"
          style={{ fontSize: '11px', fontWeight: 500 }}
        >
          Agent
        </Badge>
      );
    }
  };

  return (
    <div className="p-6">
      {/* Header with Filters */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Select value={filterRole} onValueChange={setFilterRole}>
            <SelectTrigger className="w-40 border-gray-300" style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}>
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="Lead Broker">Lead Broker</SelectItem>
              <SelectItem value="Client Contact">Client Contact</SelectItem>
              <SelectItem value="Legal Counsel">Legal Counsel</SelectItem>
              <SelectItem value="Deal Coordinator">Deal Coordinator</SelectItem>
              <SelectItem value="Structure requirement">Structure requirement</SelectItem>
              <SelectItem value="Build collection">Build collection</SelectItem>
              <SelectItem value="Assess collection">Assess collection</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-40 border-gray-300" style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}>
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Internal">Internal</SelectItem>
              <SelectItem value="External">External</SelectItem>
              <SelectItem value="Agent">Agent</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="text-white"
          style={{ 
            backgroundColor: '#005B94',
            fontSize: '14px', 
            fontWeight: 500, 
            fontFamily: 'Inter, sans-serif' 
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Member
        </Button>
      </div>

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 gap-3">
        {filteredMembers.map((member) => (
          <Card 
            key={member.id} 
            className="bg-white border hover:shadow-md transition-shadow"
            style={{ borderColor: '#E5E7EB' }}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  {/* Avatar */}
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: member.type === 'Agent' ? '#D1FAE5' : '#E3F2FD' }}
                  >
                    {member.type === 'Agent' ? (
                      <Bot className="h-8 w-8" style={{ color: '#059669' }} />
                    ) : (
                      <UserCircle className="h-8 w-8" style={{ color: '#005B94' }} />
                    )}
                  </div>

                  {/* Member Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span style={{ fontSize: '16px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                        {member.name}
                      </span>
                      {getTypeBadge(member.type)}
                    </div>

                    {/* Role & Organization */}
                    <div className="flex items-center gap-2 mb-2">
                      <span style={{ fontSize: '14px', fontWeight: 500, color: '#005B94', fontFamily: 'Inter, sans-serif' }}>
                        {member.role}
                      </span>
                      <span className="text-gray-400">•</span>
                      <div className="flex items-center gap-1" style={{ fontSize: '14px', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
                        <Building2 className="h-3 w-3" />
                        {member.organization}
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex items-center gap-2" style={{ fontSize: '14px', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
                        <Mail className="h-3 w-3" />
                        <a href={`mailto:${member.email}`} className="hover:underline" style={{ color: '#005B94' }}>
                          {member.email}
                        </a>
                      </div>
                      {member.phone && (
                        <div className="flex items-center gap-2" style={{ fontSize: '14px', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
                          <Phone className="h-3 w-3" />
                          {member.phone}
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    {member.description && (
                      <div className="mt-2" style={{ fontSize: '14px', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
                        {member.description}
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 ml-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:bg-gray-100"
                  >
                    <Edit2 className="h-4 w-4" style={{ color: '#6B7280' }} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" style={{ color: '#DC2626' }} />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Team Member Modal */}
      <AddTeamMemberModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={(member) => {
          setTeamMembers([...teamMembers, { ...member, id: Date.now().toString() }]);
          setIsAddModalOpen(false);
        }}
      />
    </div>
  );
}