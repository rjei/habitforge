package org.example.habitforgeclient.ui.profile;

import javax.swing.*;
import java.awt.*;
import org.example.habitforgeclient.model.CharacterModel;
import org.example.habitforgeclient.ui.components.ExpBar;

public class ProfilePanel extends JPanel {
    private final JLabel lvlLabel;
    private final JLabel xpLabel;
    private final ExpBar expBar;

    public ProfilePanel() {
        setLayout(new BoxLayout(this, BoxLayout.Y_AXIS));
        setBackground(new Color(8, 10, 15)); // Ultra Dark Sidebar
        setBorder(BorderFactory.createEmptyBorder(30, 20, 30, 20));
        setPreferredSize(new Dimension(240, 0));

        // Logo / App Name
        JLabel logoLabel = new JLabel("HabitForge");
        logoLabel.setFont(new Font("Segoe UI", Font.BOLD, 22));
        logoLabel.setForeground(Color.WHITE);
        logoLabel.setAlignmentX(Component.LEFT_ALIGNMENT);

        // Section Hub
        JLabel hubLabel = new JLabel("SHRINE QUEST HUB");
        hubLabel.setFont(new Font("Segoe UI", Font.BOLD, 11));
        hubLabel.setForeground(new Color(155, 89, 182)); // Purple accent
        hubLabel.setBorder(BorderFactory.createEmptyBorder(30, 0, 10, 0));
        hubLabel.setAlignmentX(Component.LEFT_ALIGNMENT);

        // Menu items mockup
        JLabel menu1 = createMenuItem("THE GRIMOIRE", true);
        JLabel menu2 = createMenuItem("HALL OF FAME", false);
        JLabel menu3 = createMenuItem("SAGE'S SANCTUM", false);

        // Character Info Widget bawah
        JPanel charWidget = new JPanel();
        charWidget.setLayout(new BoxLayout(charWidget, BoxLayout.Y_AXIS));
        charWidget.setOpaque(false);
        charWidget.setBorder(BorderFactory.createEmptyBorder(40, 0, 0, 0));
        charWidget.setAlignmentX(Component.LEFT_ALIGNMENT);

        lvlLabel = new JLabel("Level 24 Paladin");
        lvlLabel.setFont(new Font("Segoe UI", Font.BOLD, 14));
        lvlLabel.setForeground(new Color(230, 235, 245));

        xpLabel = new JLabel("XP: 14.2K / 15K");
        xpLabel.setFont(new Font("Segoe UI", Font.PLAIN, 11));
        xpLabel.setForeground(new Color(100, 110, 130));

        expBar = new ExpBar();
        expBar.setAlignmentX(Component.LEFT_ALIGNMENT);

        charWidget.add(lvlLabel);
        charWidget.add(Box.createVerticalStrut(4));
        charWidget.add(xpLabel);
        charWidget.add(Box.createVerticalStrut(8));
        charWidget.add(expBar);

        add(logoLabel);
        add(hubLabel);
        add(menu1);
        add(Box.createVerticalStrut(12));
        add(menu2);
        add(Box.createVerticalStrut(12));
        add(menu3);
        add(Box.createVerticalGlue());
        add(charWidget);
    }

    private JLabel createMenuItem(String text, boolean active) {
        JLabel item = new JLabel(text);
        item.setFont(new Font("Segoe UI", Font.BOLD, 12));
        item.setForeground(active ? Color.WHITE : new Color(100, 110, 130));
        item.setAlignmentX(Component.LEFT_ALIGNMENT);
        return item;
    }

    public void updateCharacter(CharacterModel character) {
        if (character == null) return;
        lvlLabel.setText("Level " + character.level() + " Paladin");
        xpLabel.setText(String.format("XP: %d / %d", character.totalXp(), character.xpToNextLevel()));
        expBar.updateXp(character.totalXp(), character.xpToNextLevel());
    }
}