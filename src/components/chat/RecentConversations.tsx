import { SidebarGroup, SidebarGroupLabel } from '../ui/sidebar';
import ConversationCard from './ConversationCard';

// Sample conversations data
const sampleConversations = [
  {
    id: '1',
    title: 'How to tailor my resume for software engineer role',
    updatedAt: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
  },
  {
    id: '2',
    title: 'Cover letter tips for marketing position',
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
  },
  {
    id: '3',
    title: 'Interview preparation questions',
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
  },
  {
    id: '4',
    title: 'Resume formatting best practices',
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
  },
];

const RecentConversations = () => {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Recent Chats</SidebarGroupLabel>
      <div className="space-y-1 px-2">
        {sampleConversations.map((conversation) => (
          <ConversationCard
            key={conversation.id}
            id={conversation.id}
            title={conversation.title}
            updatedAt={conversation.updatedAt}
            onClick={() => console.log('Clicked:', conversation.id)}
          />
        ))}
      </div>
    </SidebarGroup>
  );
};

export default RecentConversations;
