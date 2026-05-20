package org.example.habitforgeclient;

import javax.swing.*;
import java.awt.*;
import java.util.ArrayList;
import java.util.List;
import org.example.habitforgeclient.model.CharacterModel;
import org.example.habitforgeclient.model.HabitModel;
import org.example.habitforgeclient.ui.dashboard.DashboardPanel;
import org.example.habitforgeclient.ui.profile.ProfilePanel;

public class MainApp extends JFrame {
    private final ProfilePanel profilePanel;
    private final DashboardPanel dashboardPanel;

    public MainApp() {
        setTitle("HabitForge");
        setSize(950, 650);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLocationRelativeTo(null);
        getContentPane().setBackground(new Color(11, 14, 20));

        profilePanel = new ProfilePanel();
        dashboardPanel = new DashboardPanel();

        add(profilePanel, BorderLayout.WEST);
        add(dashboardPanel, BorderLayout.CENTER);

        loadInitialRPGData();
    }

    private void loadInitialRPGData() {
        // Mocking data agar sesuai persis dengan gambar Grimoire-mu
        CharacterModel hero = new CharacterModel(1L, 24, 14200, 15000, 120, 95, 1.0, null);
        profilePanel.updateCharacter(hero);

        List<HabitModel> quests = new ArrayList<>();
        quests.add(new HabitModel(1L, "Meditation Ritual", "DAILY", "Dawn", 158, 12, null, null, null));
        quests.add(new HabitModel(2L, "Strength Training", "WEEKLY", "Afternoon", 508, 28, null, null, null));
        quests.add(new HabitModel(3L, "Deep Focus Code", "DAILY", "Morning", 250, 42, null, null, null));

        dashboardPanel.refreshHabits(quests, id -> System.out.println("Quest ID " + id + " Completed!"));
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> new MainApp().setVisible(true));
    }
}