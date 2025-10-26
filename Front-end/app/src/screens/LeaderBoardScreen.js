import React, { useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Trophy, Star, Flame, Zap, Award, User, Crown } from 'lucide-react-native';
import { useTheme } from '@contexts/ThemeProvider';
import { useDispatch, useSelector } from 'react-redux';
import { getLeaderboard } from '@/redux/slices/achievementSlice';

const { width } = Dimensions.get('window');

export default function LeaderboardScreen({ navigation }) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  
  const dispatch = useDispatch();
  const { leaderboard, pagination, isLoading, error } = useSelector((state) => state.achievement);
  const [page, setPage] = React.useState(1);
  const [refreshing, setRefreshing] = React.useState(false);

  const fetchLeaderboard = async (pageNum = 1, isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      }

      await dispatch(getLeaderboard({ 
        page: pageNum, 
        limit: 20, 
        sortBy: 'totalPoints', 
        order: 'desc' 
      })).unwrap();
      
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard(page);
  }, [page]);

  const getMedalColor = (rank) => {
  if (rank === 1) return '#EEC756';
  if (rank === 2) return '#C0C0C0';
  if (rank === 3) return '#CD7F32';
  return '#FFFFFF';  // ✅ FORCE màu trắng, không dùng colors.card
};

  const getLevelConfig = (level) => {
    const config = {
      gold: { color: '#FFD700', label: 'Gold', icon: Crown },
      silver: { color: '#C0C0C0', label: 'Silver', icon: Award },
      bronze: { color: '#CD7F32', label: 'Bronze', icon: Award },
      none: { color: '#9CA3AF', label: 'Beginner', icon: Star }
    };
    return config[level] || config.none;
  };

  const renderItem = ({ item, index }) => {
    const rank = (page - 1) * 20 + index + 1;
    const isTopThree = rank <= 3;
    const bgColor = getMedalColor(rank);
    const levelConfig = getLevelConfig(item.currentLevel);
    const LevelIcon = levelConfig.icon;

    return (
      <View style={[styles.card, isTopThree && { backgroundColor: bgColor }]}>
        {/* Rank Badge */}
        <View style={styles.rankBadge}>
          {isTopThree ? (
            <Trophy size={28} color="#FFFFFF" />
          ) : (
            <View style={styles.rankCircle}>
              <Text style={styles.rankText}>{rank}</Text>
            </View>
          )}
        </View>

        {/* User Info */}
        <View style={styles.userSection}>
          <View style={styles.avatarContainer}>
            {item.userInfo?.avatarUrl ? (
              <Image source={{ uri: item.userInfo.avatarUrl }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <User size={32} color="#CCCCCC" />
              </View>
            )}
            {isTopThree && (
              <View style={[styles.crownBadge, { backgroundColor: bgColor }]}>
                <Trophy size={12} color="#FFFFFF" />
              </View>
            )}
          </View>

          <View style={styles.userDetails}>
            <Text style={[styles.userName, isTopThree && { color: '#FFFFFF' }]} numberOfLines={1}>
              {item.userInfo?.fullName || 'Anonymous'}
            </Text>
            <Text style={[styles.userHandle, isTopThree && { color: 'rgba(255,255,255,0.8)' }]} numberOfLines={1}>
              @{item.userInfo?.username || 'unknown'}
            </Text>
            
            {/* Level Badge */}
            <View style={[styles.levelTag, isTopThree && { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
              <LevelIcon size={12} color={isTopThree ? '#FFFFFF' : levelConfig.color} />
              <Text style={[styles.levelText, isTopThree && { color: '#FFFFFF' }]}>
                {levelConfig.label}
              </Text>
            </View>
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={[styles.statBox, isTopThree && styles.statBoxTopThree]}>
            <Flame size={14} color={isTopThree ? '#FFFFFF' : '#F59E0B'} />
            <Text style={[styles.statValue, isTopThree && { color: '#FFFFFF' }]}>
              {item.easyDishCount || 0}
            </Text>
          </View>
          <View style={[styles.statBox, isTopThree && styles.statBoxTopThree]}>
            <Zap size={14} color={isTopThree ? '#FFFFFF' : '#EF4444'} />
            <Text style={[styles.statValue, isTopThree && { color: '#FFFFFF' }]}>
              {item.mediumDishCount || 0}
            </Text>
          </View>
          <View style={[styles.statBox, isTopThree && styles.statBoxTopThree]}>
            <Star size={14} color={isTopThree ? '#FFFFFF' : '#8B5CF6'} />
            <Text style={[styles.statValue, isTopThree && { color: '#FFFFFF' }]}>
              {item.hardDishCount || 0}
            </Text>
          </View>
        </View>

        {/* Points */}
        <View style={styles.pointsContainer}>
          <Star size={18} color="#FFA500" fill="#FFA500" />
          <Text style={styles.pointsValue}>{(item.totalPoints || 0).toLocaleString()}</Text>
          <Text style={styles.pointsLabel}>points</Text>
        </View>
      </View>
    );
  };

  const renderFooter = () => {
    if (!pagination || pagination.totalPages <= 1) return null;

    return (
      <View style={styles.paginationContainer}>
        <TouchableOpacity
          style={[styles.pageButton, page === 1 && styles.pageButtonDisabled]}
          onPress={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          <ArrowLeft size={18} color={page === 1 ? '#999999' : colors.primary} />
          <Text style={[styles.pageButtonText, page === 1 && { color: '#999999' }]}>Prev</Text>
        </TouchableOpacity>

        <View style={styles.pageIndicator}>
          <Text style={styles.pageText}>{page} / {pagination.totalPages}</Text>
        </View>

        <TouchableOpacity
          style={[styles.pageButton, page === pagination.totalPages && styles.pageButtonDisabled]}
          onPress={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
          disabled={page === pagination.totalPages}
        >
          <Text style={[styles.pageButtonText, page === pagination.totalPages && { color: '#999999' }]}>
            Next
          </Text>
          <ArrowLeft 
            size={18} 
            color={page === pagination.totalPages ? '#999999' : colors.primary}
            style={{ transform: [{ rotate: '180deg' }] }}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Trophy size={80} color="#E5E7EB" />
      <Text style={styles.emptyTitle}>No Rankings Yet</Text>
      <Text style={styles.emptySubtitle}>Start cooking to earn points and climb the leaderboard!</Text>
    </View>
  );

  const renderError = () => (
    <View style={styles.emptyContainer}>
      <Trophy size={80} color="#EF4444" />
      <Text style={styles.emptyTitle}>Failed to Load</Text>
      <Text style={styles.emptySubtitle}>{error}</Text>
      <TouchableOpacity style={styles.retryButton} onPress={() => fetchLeaderboard(page)}>
        <Text style={styles.retryButtonText}>Try Again</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color={colors.title} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Trophy size={28} color="#FFA500" />
          <Text style={styles.headerTitle}>Leaderboard</Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      {/* Content */}
      {isLoading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading rankings...</Text>
        </View>
      ) : error ? (
        renderError()
      ) : (
        <FlatList
          data={leaderboard}
          keyExtractor={(item, index) => `${item.userId}-${index}-${page}`}
          renderItem={renderItem}
          ListEmptyComponent={renderEmpty}
          ListFooterComponent={renderFooter}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => fetchLeaderboard(page, true)}
              tintColor={colors.primary}
            />
          }
        />
      )}
    </SafeAreaView>
  );
}

const createStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border || '#E5E7EB'
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center'
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.title
  },
  headerSpacer: {
    width: 40
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12
  },
  loadingText: {
    fontSize: 14,
    color: colors.description,
    marginTop: 8
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: 60
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.title,
    marginTop: 20
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.description,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20
  },
  retryButton: {
    marginTop: 24,
    paddingHorizontal: 32,
    paddingVertical: 14,
    backgroundColor: colors.primary,
    borderRadius: 12
  },
  retryButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF'
  },
  listContainer: {
    padding: 16,
    paddingBottom: 24
  },
  card: {
  backgroundColor: '#FFFFFF',  
  borderRadius: 16,
  padding: 16,
  marginBottom: 12,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 8,
  elevation: 3
},
  rankBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 1
  },
  rankCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center'
  },
  rankText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF'
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12
  },
  avatarContainer: {
    position: 'relative'
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: '#FFFFFF'
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF'
  },
  crownBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF'
  },
  userDetails: {
    flex: 1,
    gap: 4
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.title
  },
  userHandle: {
    fontSize: 13,
    color: colors.description
  },
  levelTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    marginTop: 4
  },
  levelText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.description
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12
  },
  statBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    backgroundColor: 'rgba(0,0,0,0.03)',
    borderRadius: 10
  },
  statBoxTopThree: {
    backgroundColor: 'rgba(255,255,255,0.2)'
  },
  statValue: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.title
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    backgroundColor: colors.secondary,
    borderRadius: 12
  },
  pointsValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF'
  },
  pointsLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
    opacity: 0.9
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border || '#E5E7EB'
  },
  pageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: colors.card,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border || '#E5E7EB'
  },
  pageButtonDisabled: {
    opacity: 0.5
  },
  pageButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary
  },
  pageIndicator: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: colors.card,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.primary
  },
  pageText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.title
  }
});