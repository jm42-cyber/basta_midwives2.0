import { motion } from 'framer-motion';
import { 
  Info, Target, Eye, Heart, Users, GraduationCap, Code
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';

export default function AboutPage() {
  const teamMembers = [
    { name: 'Karl Benedict Boongaling', role: 'Lead Developer', icon: '👨💻' },
    { name: 'Ernest James De Leon', role: 'Backend Developer', icon: '👨💻' },
    { name: 'Jay Mark Del Valle', role: 'Frontend Developer', icon: '👨💻' },
    { name: 'Mark Jopher Domanico', role: 'System Analyst', icon: '👨💻' },
  ];

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-16 h-16 shadow-lg bg-gradient-to-br from-primary-600 to-primary-500 rounded-2xl">
              <Info className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-transparent bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text">
                About MediMoms
              </h1>
              <p className="flex items-center gap-2 mt-1 text-gray-600">
                <Heart className="w-4 h-4" />
                Empowering healthcare through technology
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Mission, Vision, Commitment */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Mission */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Mission</h2>
              </div>
              <p className="text-gray-600 leading-relaxed">
                To provide an efficient, user-friendly digital platform that empowers midwives in Santa Cruz, Laguna 
                to deliver quality healthcare services through streamlined record management and data-driven insights.
              </p>
            </motion.div>

            {/* Vision */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl">
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Vision</h2>
              </div>
              <p className="text-gray-600 leading-relaxed">
                To become the leading healthcare management system in the region, setting the standard for 
                maternal and child health record keeping while fostering better health outcomes for communities.
              </p>
            </motion.div>

            {/* Commitment */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Commitment</h2>
              </div>
              <ul className="text-gray-600 leading-relaxed space-y-2">
                <li><strong className="text-gray-900">User-Centered Design:</strong> We listen to our users and continuously refine the system based on real-world feedback</li>
                <li><strong className="text-gray-900">Data Security:</strong> Patient privacy and data security are paramount with the highest security standards</li>
                <li><strong className="text-gray-900">Reliability:</strong> We ensure system availability and data integrity for healthcare professionals</li>
                <li><strong className="text-gray-900">Support & Training:</strong> Comprehensive documentation and help resources for all users</li>
                <li><strong className="text-gray-900">Innovation:</strong> We stay current with technology trends and healthcare best practices</li>
              </ul>
            </motion.div>
          </div>

          {/* Academic Background */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Academic Background</h2>
            </div>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                MediMoms is the culmination of academic excellence and practical innovation, developed as a comprehensive 
                capstone project by Bachelor of Science in Information Technology (BSIT) students from 
                <strong className="text-gray-900"> Laguna State Polytechnic University (LSPU)</strong>.
              </p>
              <p>
                This project represents the intersection of academic learning and real-world problem-solving, addressing 
                genuine needs in healthcare management within the local community of Santa Cruz, Laguna. Through extensive 
                research, user requirement analysis, and iterative development, the team has created a system that serves 
                both educational objectives and practical healthcare delivery needs.
              </p>
              <p>
                The development process incorporated software engineering best practices, including requirements analysis, 
                system design, database design, user interface development, testing, and deployment. This project demonstrates 
                the students' mastery of full-stack web development, database management, and software project management.
              </p>
            </div>
          </motion.div>

          {/* Development Team */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Development Team</h2>
            </div>
            <p className="text-center text-gray-600 mb-8 text-lg">
              Developed with dedication and expertise by BSIT students from <strong className="text-gray-900">Laguna State Polytechnic University</strong>
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="bg-gradient-to-br from-primary-50 to-white border border-primary-200 rounded-xl p-6 text-center hover:shadow-lg transition-all"
                >
                  <div className="text-5xl mb-4">{member.icon}</div>
                  <h3 className="font-bold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-sm text-primary-600 font-semibold">{member.role}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Technology Stack */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-gradient-to-br from-primary-600 to-primary-500 rounded-2xl p-6 shadow-lg text-white"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-xl">
                <Code className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold">Technology Stack</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/10 rounded-xl p-4 text-center backdrop-blur-sm">
                <p className="font-bold text-lg">React</p>
                <p className="text-sm text-primary-100">Frontend</p>
              </div>
              <div className="bg-white/10 rounded-xl p-4 text-center backdrop-blur-sm">
                <p className="font-bold text-lg">TypeScript</p>
                <p className="text-sm text-primary-100">Language</p>
              </div>
              <div className="bg-white/10 rounded-xl p-4 text-center backdrop-blur-sm">
                <p className="font-bold text-lg">Laravel</p>
                <p className="text-sm text-primary-100">Backend</p>
              </div>
              <div className="bg-white/10 rounded-xl p-4 text-center backdrop-blur-sm">
                <p className="font-bold text-lg">MySQL</p>
                <p className="text-sm text-primary-100">Database</p>
              </div>
            </div>
          </motion.div>

          {/* Footer Info */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm text-center">
            <p className="text-gray-600">
              <strong className="text-gray-900">MediMoms</strong> - Midwife Recording System
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Santa Cruz, Laguna • Version 2.0.0 • © 2024 LSPU BSIT
            </p>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
