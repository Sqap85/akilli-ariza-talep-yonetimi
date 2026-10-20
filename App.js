import React, { useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const CATEGORIES = ['Bilgisayar', 'İnternet', 'Yazıcı', 'Yazılım'];
const STATUSES = ['Bekliyor', 'İşlemde', 'Tamamlandı'];
const EMPTY_FORM = { title: '', description: '', category: '' };

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function AppContent() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState('Tümü');

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const validateForm = () => {
    const nextErrors = {};
    if (!form.title.trim()) nextErrors.title = 'Başlık boş bırakılamaz.';
    if (!form.description.trim()) nextErrors.description = 'Açıklama boş bırakılamaz.';
    if (!form.category) nextErrors.category = 'Bir kategori seçiniz.';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const submitRequest = () => {
    if (!validateForm()) {
      Alert.alert('Eksik bilgi', 'Başlık, açıklama ve kategori alanlarını kontrol ediniz.');
      return;
    }

    const request = {
      id: createId(),
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category,
      status: 'Bekliyor',
    };
    setRequests((current) => [request, ...current]);
    setForm(EMPTY_FORM);
    setErrors({});
    Alert.alert('Kayıt başarılı', 'Arıza talebiniz listeye eklendi.');
  };

  const showDetails = (request) => {
    Alert.alert(
      request.title,
      `Açıklama: ${request.description}\nKategori: ${request.category}\nDurum: ${request.status}`,
    );
  };

  const confirmDelete = (request) => {
    Alert.alert(
      'Talebi sil',
      `"${request.title}" başlıklı talep silinsin mi?`,
      [
        { text: 'Vazgeç', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: () => {
            setRequests((current) => current.filter((item) => item.id !== request.id));
            Alert.alert('Silindi', 'Talep listeden kaldırıldı.');
          },
        },
      ],
    );
  };

  const changeStatus = (id, status) => {
    setRequests((current) =>
      current.map((request) => (request.id === id ? { ...request, status } : request)),
    );
  };

  const visibleRequests = useMemo(
    () => (filter === 'Tümü' ? requests : requests.filter((request) => request.status === filter)),
    [filter, requests],
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor="#111111" />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.eyebrow}>HAFTA 5 · YEREL UYGULAMA</Text>
        <Text style={styles.title}>Akıllı Arıza</Text>
        <Text style={styles.titleAccent}>Talep Yönetimi</Text>
        <Text style={styles.subtitle}>
          Talebini oluştur, durumunu takip et. Karta kısa dokunarak detayları görebilirsin.
        </Text>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Yeni talep</Text>
          <Field
            label="Talep başlığı"
            placeholder="Örn. İnternet bağlantısı yok"
            value={form.title}
            onChangeText={(value) => updateField('title', value)}
            error={errors.title}
          />
          <Field
            label="Açıklama"
            placeholder="Arızayı kısaca açıklayın"
            value={form.description}
            onChangeText={(value) => updateField('description', value)}
            error={errors.description}
            multiline
          />
          <Text style={styles.label}>Kategori</Text>
          <View style={styles.chipRow}>
            {CATEGORIES.map((category) => (
              <Chip
                key={category}
                label={category}
                selected={form.category === category}
                onPress={() => updateField('category', category)}
              />
            ))}
          </View>
          {errors.category ? <Text style={styles.error}>{errors.category}</Text> : null}
          <Pressable
            accessibilityRole="button"
            onPress={submitRequest}
            style={({ pressed }) => [styles.submit, pressed && styles.pressed]}
          >
            <Text style={styles.submitText}>Talep oluştur</Text>
          </Pressable>
        </View>

        <View style={styles.listHeader}>
          <View>
            <Text style={styles.sectionTitle}>Taleplerim</Text>
            <Text style={styles.countText}>{requests.length} kayıt</Text>
          </View>
          <Text style={styles.hint}>Uzun bas: sil</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
          {['Tümü', ...STATUSES].map((status) => (
            <Chip key={status} label={status} selected={filter === status} onPress={() => setFilter(status)} />
          ))}
        </ScrollView>

        {visibleRequests.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>✓</Text>
            <Text style={styles.emptyTitle}>
              {requests.length === 0 ? 'Henüz talep yok' : 'Bu filtrede talep yok'}
            </Text>
            <Text style={styles.emptyText}>İlk arıza talebini yukarıdaki formdan oluşturabilirsin.</Text>
          </View>
        ) : (
          visibleRequests.map((request) => (
            <Pressable
              key={request.id}
              onPress={() => showDetails(request)}
              onLongPress={() => confirmDelete(request)}
              delayLongPress={500}
              style={({ pressed }) => [styles.requestCard, pressed && styles.pressed]}
            >
              <View style={styles.requestTop}>
                <View style={styles.requestTitleWrap}>
                  <Text style={styles.requestTitle}>{request.title}</Text>
                  <Text style={styles.categoryText}>{request.category}</Text>
                </View>
                <View style={[styles.statusBadge, statusStyles[request.status]]}>
                  <Text style={styles.statusText}>{request.status}</Text>
                </View>
              </View>
              <Text numberOfLines={2} style={styles.description}>{request.description}</Text>
              <View style={styles.statusOptions}>
                {STATUSES.map((status) => (
                  <Pressable
                    key={status}
                    onPress={() => changeStatus(request.id, status)}
                    style={[styles.statusOption, request.status === status && styles.activeStatusOption]}
                  >
                    <Text style={[styles.statusOptionText, request.status === status && styles.activeStatusText]}>
                      {status}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </Pressable>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function Field({ label, error, multiline = false, ...props }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        {...props}
        style={[styles.input, multiline && styles.multiline, error && styles.inputError]}
        placeholderTextColor="#94a3b8"
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

function Chip({ label, selected, onPress }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[styles.chip, selected && styles.selectedChip]}
    >
      <Text style={[styles.chipText, selected && styles.selectedChipText]}>{label}</Text>
    </Pressable>
  );
}

const statusStyles = {
  Bekliyor: { backgroundColor: '#3d2b16' },
  İşlemde: { backgroundColor: '#26384a' },
  Tamamlandı: { backgroundColor: '#193b2a' },
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111111' },
  content: { padding: 20, paddingBottom: 40 },
  eyebrow: { color: '#a7a7a7', fontSize: 11, fontWeight: '700', letterSpacing: 1.2, marginBottom: 8 },
  title: { color: '#f5f5f5', fontSize: 30, fontWeight: '800', lineHeight: 34 },
  titleAccent: { color: '#f7931a', fontSize: 30, fontWeight: '800', lineHeight: 34 },
  subtitle: { color: '#b6b6b6', fontSize: 14, lineHeight: 21, marginTop: 10, marginBottom: 20 },
  card: { backgroundColor: '#1c1c1c', borderRadius: 18, padding: 18, marginBottom: 24, shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 2 },
  sectionTitle: { color: '#f5f5f5', fontSize: 20, fontWeight: '800' },
  field: { marginTop: 16 },
  label: { color: '#d0d0d0', fontSize: 13, fontWeight: '700', marginBottom: 8 },
  input: { borderColor: '#414141', borderRadius: 10, borderWidth: 1, color: '#f5f5f5', fontSize: 15, height: 46, paddingHorizontal: 13, backgroundColor: '#272727' },
  multiline: { height: 86, paddingTop: 12 },
  inputError: { borderColor: '#ef5350' },
  error: { color: '#ff807d', fontSize: 12, marginTop: 5 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { borderColor: '#4a4a4a', borderRadius: 20, borderWidth: 1, paddingHorizontal: 13, paddingVertical: 9, backgroundColor: '#292929' },
  selectedChip: { backgroundColor: '#f7931a', borderColor: '#f7931a' },
  chipText: { color: '#d0d0d0', fontSize: 13, fontWeight: '600' },
  selectedChipText: { color: '#111111' },
  submit: { alignItems: 'center', backgroundColor: '#f7931a', borderRadius: 11, marginTop: 20, paddingVertical: 14 },
  submitText: { color: '#fff', fontSize: 15, fontWeight: '800' },
  pressed: { opacity: 0.76 },
  listHeader: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  countText: { color: '#9a9a9a', fontSize: 12, marginTop: 3 },
  hint: { color: '#9a9a9a', fontSize: 12 },
  filterRow: { gap: 8, paddingBottom: 15 },
  empty: { alignItems: 'center', backgroundColor: '#1c1c1c', borderRadius: 16, padding: 30 },
  emptyIcon: { alignItems: 'center', backgroundColor: '#3d2b16', borderRadius: 25, color: '#f7931a', fontSize: 25, height: 50, lineHeight: 50, textAlign: 'center', width: 50 },
  emptyTitle: { color: '#f5f5f5', fontSize: 16, fontWeight: '800', marginTop: 14 },
  emptyText: { color: '#a7a7a7', fontSize: 13, marginTop: 6, textAlign: 'center' },
  requestCard: { backgroundColor: '#1c1c1c', borderRadius: 16, marginBottom: 12, padding: 16, shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 1 },
  requestTop: { alignItems: 'flex-start', flexDirection: 'row', justifyContent: 'space-between' },
  requestTitleWrap: { flex: 1, paddingRight: 10 },
  requestTitle: { color: '#f5f5f5', fontSize: 16, fontWeight: '800' },
  categoryText: { color: '#f7931a', fontSize: 12, fontWeight: '700', marginTop: 5 },
  statusBadge: { borderRadius: 12, paddingHorizontal: 9, paddingVertical: 6 },
  statusText: { color: '#e0e0e0', fontSize: 11, fontWeight: '700' },
  description: { color: '#b6b6b6', fontSize: 13, lineHeight: 19, marginTop: 12 },
  statusOptions: { borderTopColor: '#383838', borderTopWidth: 1, flexDirection: 'row', gap: 6, marginTop: 14, paddingTop: 12 },
  statusOption: { borderColor: '#474747', borderRadius: 8, borderWidth: 1, flex: 1, paddingVertical: 7 },
  activeStatusOption: { backgroundColor: '#3d2b16', borderColor: '#f7931a' },
  statusOptionText: { color: '#a7a7a7', fontSize: 10, textAlign: 'center' },
  activeStatusText: { color: '#f7931a', fontWeight: '800' },
});

export default function App() {
  return (
    <SafeAreaProvider>
      <AppContent />
    </SafeAreaProvider>
  );
}
